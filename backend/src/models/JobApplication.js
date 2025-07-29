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
    aiFit: {
      fitScore: { type: Number },
      summary: { type: String },
      matchedSkills: [String],
      missingSkills: [String],
      evaluated: { type: Boolean, default: false },
    },
    // ✅ NEW FIELDS
    salary: {
      type: String,
    },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Remote", "Freelance", "Internship", "Contract"],
      default: "Full-time",
    },

    applicationUrl: {
      type: String, // link to job post or application
    },
    contactPerson: {
      type: String, // Recruiter's name, HR contact, etc.
    },
    notes: {
      type: String, // Custom user notes, follow-up, interview notes, etc.
    },
  },
  { timestamps: true }
);

const JobApplication = mongoose.model("JobApplication", jobApplicationSchema);
export default JobApplication;
