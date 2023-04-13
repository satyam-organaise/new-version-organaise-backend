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

folderModel.virtual('files', {
    ref: 'fileData',
    localField: 'filesList',
    foreignField: '_id',
    justOne: false
});

export default mongoose.model("folderData", folderModel, "folderData");