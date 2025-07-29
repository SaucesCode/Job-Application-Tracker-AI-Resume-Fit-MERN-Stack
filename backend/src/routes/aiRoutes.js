import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getFitScore } from "../controllers/aiController.js";

const router = express.Router();

router.post("/fit-score", protect, getFitScore);

export default router;
