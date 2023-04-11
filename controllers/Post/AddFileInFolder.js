
import folderModel from "../../model/folderModel.js"

const AddFileInFolder = async (req, res) => {
    const folderId = req.body.folderId;
    const userId = req.body.userId;
    const fileId = req.body.fileId;
    const selectFolder = await folderModel.find({ _id: {$eq : folderId } });
   
    if (selectFolder.length > 0) {
        if (selectFolder[0].userId === userId) {
            let selectFiles = [...selectFolder[0].filesList, fileId];
            let removeDuplicate = [...new Set(selectFiles)];
            folderModel.updateOne({ _id: folderId},
            {$set: { filesList: removeDuplicate}}).
            then((d)=>{
                res.status(200).json({
                    message: "Document update successfully",
                    status: true
                })
            }).catch((error)=>{
                res.status(500).json({
                    message: "file not added.Something is wrong",
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

export default AddFileInFolder;