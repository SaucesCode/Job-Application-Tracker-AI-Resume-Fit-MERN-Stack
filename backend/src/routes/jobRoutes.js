import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobStats,
} from "../controllers/jobController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getJobs).post(createJob);
router.get("/stats", protect, getJobStats);
router.route("/:id").get(getJobById).put(updateJob).delete(deleteJob);

export default router;
