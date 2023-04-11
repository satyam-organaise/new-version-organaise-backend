
import folderModel from "../../model/folderModel.js"


const createFolder = async (req, res) => {
    const folderName = req.body.folderName;
    const folderDiscription = req.body.folderDiscription;
    const userId = req.body.userId;

    const createFolderObj = { folderName: folderName, folderDiscription: folderDiscription, filesList: [], userId: userId };
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

export default createFolder;