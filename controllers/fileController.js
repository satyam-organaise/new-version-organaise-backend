import fileModel from "../model/fileModel.js";
import dotenv from "dotenv";
import AWS from "aws-sdk";
import { v4 as uuid } from "uuid";
///////// upload the file ///////////////
dotenv.config();
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET
})

const fileUploadByUser = async (req, res) => {
    const userid = req.body.userId;
    const fileSize = req.body.fileSize;
    const myFile = req.file.originalname.split(".")
    const fileType = myFile[myFile.length - 1]
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${uuid()}.${fileType}`,
        Body: req.file.buffer,
        ACL: 'public-read'
    }
    let saveFileDataObj = {}

    s3.upload(params, (error, data) => {
        if (error) {
            res.status(500).send(error)
        }
        if (data.Location) {
            saveFileDataObj = {
                userId: userid,
                fileURL: data.Location,
                fileName: req.file.originalname,
                fileSize: fileSize,
                fileId: data.Key.split(".")[0]
            }
            const userData = new fileModel(saveFileDataObj);
            userData.save().then((d) => {
                res.status(200).send({ data, status: true })
            }).catch((e) => {
                res.status(401).send({ error: e, status: false })
            });
        } else {
            res.status(401).send({ message: "Method is not allowed" })
        }
    })
}

///////// Get the all files /////////////
const getAllFiles = async (req, res) => {
    const userid = req.user._id;
    const selectModel = await fileModel.find({ userId: { $eq: userid } });
    res.status(200).json({
        data: selectModel,
        status: true
    })
}

///////// Delete file by user ///////////
const deleteFiles = async (req, res) => {
    const userid = String(req.user._id);
    const fileId = req.body.fileId;
    try {
        const selectModel = await fileModel.findById(fileId).exec();
        if (!selectModel) {
            res.status(200).json({
                data: [],
                status: false,
                message: "file not found",
            })
        }
        else {
            const dbUserId = selectModel?.userId;
            if (String(dbUserId) === String(userid)) {
                const result = fileModel.deleteOne({ _id: fileId }).exec();
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


export { getAllFiles, fileUploadByUser, deleteFiles }