import mongoose from "mongoose";


const createCompanyModel = new mongoose.Schema({
    companyName: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    }
})


export default mongoose.model("companyName", createCompanyModel, "companyName");