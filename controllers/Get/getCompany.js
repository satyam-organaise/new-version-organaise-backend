
import companyModel from "../../model/createCompany.js"

const getCompany = async (req, res) => {
    const userId = req.query.userId;
    if (userId) {
        await companyModel.find({ userId }).then((data) => {
            if (data.length > 0) {
                res.status(200).json({
                    message: "Company data get successfully",
                    status: true,
                    data: data,
                    userId: userId
                })
            } else {
                res.status(404).json({
                    message: "Company data not found",
                    status: false,
                })
            }

        }).catch((err) => {
            res.status(200).json({
                message: "Something is wrong to getting company name.Please try again later",
                status: false,
            })
        })
    } else {
        res.status(404).json({
            message: "Please enter userid",
            status: false,
        })
    }

}

export default getCompany;