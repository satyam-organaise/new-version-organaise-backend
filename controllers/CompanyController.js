import companyModel from "../model/createCompany.js"

const createCompany = async (req, res) => {
    const companyName = req.body.companyName;
    const userId = String(req.user._id);
    const createCompanyObj = { companyName: companyName, userId: userId };
    if (companyName) {
        const SaveData = new companyModel(createCompanyObj);
        SaveData.save().then((data) => {
            res.status(201).json({
                message: "Company created successfully",
                status: true,
        })
        }).catch((err) => {
            res.status(200).json({
                message: "Something is wrong Company not create.Please try again later",
                status: false,
            })
        })
    } else {
        res.status(406).json({
            message: "Company name is not correct",
            status: false,
        })
    }
}

const getCompany = async (req, res) => {
    const userId = req.user._id;
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



export {createCompany ,getCompany}