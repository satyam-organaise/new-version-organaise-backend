import dotenv from "dotenv";
import AWS from "aws-sdk";
import multer from "multer";
import { v4 as uuid } from "uuid";
import userModel from "../model/fileModel.js";

dotenv.config();
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET
})

const fileUpload = async (req, res) => {
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
            const userData = new userModel(saveFileDataObj);
            userData.save().then((d) => {
                res.status(200).send(data)
            }).catch((e) => {
                res.status(401).send(e)
            });

        } else {
            res.status(401).send({ message: "Method is not allowed" })
        }

    })
}
export default fileUpload;