import folderModel from "../model/folderModel.js";

const createFolder = async (req, res) => {
    const folderName = req.body.folderName;
    const folderDiscription = req.body.folderDiscription;
    const filesList = JSON.parse(req.body.filesList);
    const userId = req.user._id;

    const createFolderObj = {
        folderName: folderName,
        folderDiscription: folderDiscription,
        filesList: filesList,
        userId: userId
    };
    const SaveData = new folderModel(createFolderObj);
    SaveData.save().then((data) => {
        res.status(200).json({
            message: "Folder created successfully",
            status: true,

        })
    }).catch((err) => {
        res.status(200).json({
            message: "Something is wrong folder not create. Please try again later",
            status: false,
        })
    })

}

const GetFolders = async (req, res) => {
    const userId = req.user._id
    await folderModel.find({ userId: { $eq: userId } }).then((d) => {
        if (d.length > 0) {
            return res.status(200).json({
                message: "Data found successfully",
                status: true,
                data: d
            })
        }
        if (d.length === 0) {
            return res.status(404).json({
                message: "Folder data not found",
                status: false,
            })
        }
    }).catch((error) => {
        return res.status(500).json({
            message: "Something is wrong. Please try after sometime",
            status: false
        })
    })

}

const AddFileInFolder = async (req, res) => {
    const folderId = req.body.folderId;
    const userId = req.user._id;
    const fileId = JSON.parse(req.body.fileId);
    const selectFolder = await folderModel.find({ _id: { $eq: folderId } });

    if (selectFolder.length > 0) {
        if (String(selectFolder[0].userId) === String(userId)) {
            //let selectFiles = [...selectFolder[0].filesList, fileId];
            //let removeDuplicate = [...new Set(selectFiles)];
            folderModel.updateOne({ _id: folderId },
                { $set: { filesList: fileId } }).
                then((d) => {
                    res.status(200).json({
                        message: "Document update successfully",
                        status: true
                    })
                }).catch((error) => {
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


const deletFolder = async (req, res) => {
    const folderId = req.body.folderId;
    const userId = req.user._id;
    await folderModel.find({ userId: { $eq: userId } }).then((d) => {
        if (d.length > 0) {

            const getUserFolderData = d.filter((folderObj) => String(folderObj._id) === folderId);
            folderModel.deleteOne({ _id: folderId }).then(() => {
                return res.status(200).json({
                    message: "Folder deleted successfully",
                    status: true,
                })
            }).catch((resErr) => {
                return res.status(500).json({
                    message: "Somethng is wrong folder not deleted from db",
                    status: false
                })
            })
        }
        if (d.length === 0) {
            return res.status(404).json({
                message: "Sorry user not exists",
                status: false,
            })
        }
    }).catch((error) => {
        return res.status(500).json({
            message: "Something is wrong. Please try after sometime",
            status: false
        })
    })
}

const filesInFolder = async (req, res) => {
    const folderId = req.parse.folderId;
    await folderModel.findOne({ _id: folderId  }).populate("filesList").exec().then((d) => {
        if (d.length > 0) {
            return res.status(200).json({
                message: "Data found",
                status: true,
                data:d
            })
        }
        if (d.length === 0) {
            return res.status(404).json({
                message: "Sorry folder not found",
                status: false,
            })
        }
    }).catch((error) => {
        return res.status(500).json({
            message: "Something is wrong. Please try after sometime",
            status: false
        })
    })
}

/////// remove file  from folder
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




export { createFolder, GetFolders, deletFolder, AddFileInFolder, filesInFolder }