import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateUserProfile,
  uploadResume,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/resumes"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${req.user._id}-${uniqueSuffix}.pdf`);
  },
});
const upload = multer({ storage });

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateUserProfile);

router.post("/upload-resume", protect, upload.single("resume"), uploadResume);

export default router;
