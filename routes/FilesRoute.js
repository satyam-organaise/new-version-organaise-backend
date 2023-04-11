import express from "express";
import { protect } from '../middleware/authMiddleWare.js';
import { deleteFiles, fileUploadByUser, getAllFiles } from "../controllers/fileController.js";
import multer from "multer";

const router = express.Router();
const storage = multer.memoryStorage({
    destination: function (req, file, callback) {
        callback(null, '')
    }
})
const upload = multer({ storage }).single('fileData');
/////////////////////////////////////////////////////////////////
/////// Here we are write the code for uplode the file  /////////
////// delete the file, rename the file and other operations/////
/////////////////////////////////////////////////////////////////

router.get("/getfiles", protect, getAllFiles);
router.post("/uploadfile",upload,fileUploadByUser)
router.delete("/deleteFile",protect,deleteFiles);

export default router;