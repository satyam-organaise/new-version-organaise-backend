
import express from "express";
import { protect } from '../middleware/authMiddleWare.js';
import { createCompany, getCompany } from "../controllers/CompanyController.js";
const router = express.Router();

router.get("/", protect, getCompany).post("/create", protect, createCompany)


export default router;