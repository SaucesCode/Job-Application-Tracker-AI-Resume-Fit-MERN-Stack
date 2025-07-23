import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
    },
    status: {
      type: String,
      enum: ["saved", "applied", "interviewing", "rejected", "offer"],
      default: "saved",
    },
    dateApplied: {
      type: Date,
    },
    resumeUrl: {
      type: String, // optional, stored on Cloudinary or local
    },
    aiFitScore: {
      type: Number, // 0 to 100
    },
    aiSuggestions: {
      type: String,
    },
  },
  { timestamps: true }
);

const JobApplication = mongoose.model("JobApplication", jobApplicationSchema);
export default JobApplication;
