import mongoose from "mongoose";


const folderModel = new mongoose.Schema({

    folderName: {
        type: String,
    },
    folderDiscription: {
        type: String,
    },
    filesList: {
        type: Array
    },
    userId: {
        type: String
    }

})

export default mongoose.model("folderData", folderModel, "folderData");