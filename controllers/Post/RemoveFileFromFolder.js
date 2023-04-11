
import folderModel from "../../model/folderModel.js"


function removeDuplicateObjectFromArray(array, key) {
    var check = new Set();
    return array.filter(obj => !check.has(obj[key]) && check.add(obj[key]));
}


const removeFileFromFolder = async (req, res) => {
    const folderId = req.body.folderId;
    const userId = req.body.userId;
    const fileId = req.body.fileId;
    const selectFolder = await folderModel.find({ _id: { $eq: folderId } });

    if (selectFolder.length > 0) {
        if (selectFolder[0].userId === userId) {
            let selectFiles = [...selectFolder[0].filesList];
            let newFilesData = selectFiles.filter((extractData) => extractData.fileId !== fileId.fileId);
            let removeDuplicate = removeDuplicateObjectFromArray(newFilesData, 'fileId');
            folderModel.updateOne({ _id: folderId },
                { $set: { filesList: removeDuplicate } }).
                then((d) => {
                    res.status(200).json({
                        message: "File removed successfully",
                        status: true
                    })
                }).catch((error) => {
                    res.status(500).json({
                        message: "file not removed.Something is wrong",
                        status: false
                    })
                })
        } else {
            res.status(401).json({
                message: "Unauthorize access. Userid not exists",
                status: false
            })
        }
    }
    if (selectFolder.length === 0) {
        res.status(401).json({
            message: "Unauthorize access. Folder not found",
            status: false
        })
    }
}

export default removeFileFromFolder;