
import folderModel from "../../model/folderModel.js"

const GetFolders = async (req, res) => {
    const userId = req.body.userId;
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

export default GetFolders;