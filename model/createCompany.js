import mongoose from "mongoose";


const createCompanyModel = new mongoose.Schema({
    companyName: {
        type: String,
    },
    userId: {
        type: String
    }
})


export default mongoose.model("companyName", createCompanyModel, "companyName");