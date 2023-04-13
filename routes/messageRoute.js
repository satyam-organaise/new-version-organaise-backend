import express from "express";
import { allMessage, sendMessage } from "../controllers/messageControllers.js";
import { protect } from "../middleware/authMiddleWare.js";

const router = express.Router();
router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect , allMessage);

export default router;