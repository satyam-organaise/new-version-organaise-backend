import mongoose from "mongoose";


const folderModel = new mongoose.Schema({

    folderName: {
        type: String,
    },
    folderDiscription: {
        type: String,
    },
    filesList:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "fileData",
    }],
    userId: {
        type: String
    }

})

export default mongoose.model("folderData", folderModel, "folderData");