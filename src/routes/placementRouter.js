import express from "express";
import multer from "multer";
import path from "path";
import { getPlacements, getPlacementsByCompany, getPlacementsByYear, uploadPlacements } from "../controllers/placement.controller.js";

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save files in "uploads/" folder
    },
    filename: (req, file, cb) => {
        // Preserve original filename with timestamp to avoid duplicates
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

router.post("/upload", upload.single("file"), uploadPlacements);
router.get("/data", getPlacements);
router.get("/data/company", getPlacementsByCompany);
router.get("/data/year", getPlacementsByYear);

export default router;
