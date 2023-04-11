
import folderModel from "../../model/folderModel.js"


const deletFolder = async (req, res) => {
    const folderId = req.body.folderId;
    const userId = req.body.userId;
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


export default deletFolder;