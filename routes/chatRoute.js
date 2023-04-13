import express from "express"
import { accessChat, addToGroup, createGroupChat, fetchChats, removeFromGroup, renameGroup } from "../controllers/chatControllers.js";
import { protect } from "../middleware/authMiddleWare.js";
import { searchUserInDB } from "../controllers/AuthController.js";

const router = express.Router();

router.route("/").post(protect, accessChat).get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/groupadd").put(protect, addToGroup);
router.route("/searchUser").get(protect ,searchUserInDB);

export default router;


