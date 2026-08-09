import express from "express";
import { uploadFile } from "../controllers/uploadController.js";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only the logged-in admin can upload (matches how the dashboard calls it)
router.post("/", protect, upload.single("file"), uploadFile);

export default router;