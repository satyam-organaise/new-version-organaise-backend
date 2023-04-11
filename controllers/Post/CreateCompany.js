
import companyModel from "../../model/createCompany.js"

const createCompany = async (req, res) => {
    const companyName = req.body.companyName;
    const userId = req.body.userId;
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
        res.status(404).json({
            message: "Company name is not correct",
            status: false,
        })
    }

}

export default createCompany;