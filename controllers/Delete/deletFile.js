import userModel from "../../model/fileModel.js";



const deleteFiles = async (req, res) => {
    const userid = req.body.userId;
    const fileId = req.body.fileId;

    try {
        const selectModel = await userModel.findById(fileId).exec();
        if (!selectModel) {
            res.status(200).json({
                data: [],
                status: false,
                message: "file not found",
            })
        }
        else {
            const dbUserId = selectModel?.userId;
            if (dbUserId === userid) {
                const result = userModel.deleteOne({ _id: fileId }).exec();
                if (result.deletedCount === 0) {
                    res.status(200).json({
                        data: [],
                        status: false,
                        message: 'Document not found.',
                    })

                } else {
                    res.status(200).json({
                        status: true,
                        message: `Document deleted successfully.`,
                    })
                }

            } else {
                res.status(200).json({
                    data: selectModel,
                    status: false,
                    message: "userid not match. So file not deleted",
                })
            }

        }
    } catch (error) {
        res.status(500).json({
            data: error,
            status: false,
            message: "something is wrong. Data not found in database",
        })
    }


}

export default deleteFiles;