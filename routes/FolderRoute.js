import express from "express";
import { AddFileInFolder, 
    GetFolders, 
    createFolder, 
    deletFolder, 
    filesInFolder } from "../controllers/FolderController.js";
import { protect } from "../middleware/authMiddleWare.js";

const router = express.Router();


router.post("/create",protect, createFolder);
router.get("/",protect, GetFolders);
router.put("/FileAddFolder",protect,AddFileInFolder)
router.delete("/deleteFolder",protect, deletFolder);
router.get("/folderFiles/:folderId",protect,filesInFolder);


export default router;