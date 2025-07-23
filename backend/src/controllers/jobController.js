import JobApplication from "../models/JobApplication.js";

// GET all jobs for user
export const getJobs = async (req, res) => {
  const jobs = await JobApplication.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(jobs);
};

// CREATE new job
export const createJob = async (req, res) => {
  const job = new JobApplication({ ...req.body, userId: req.user._id });
  const saved = await job.save();
  res.status(201).json(saved);
};

// GET job by ID
export const getJobById = async (req, res) => {
  const job = await JobApplication.findById(req.params.id);
  if (job && job.userId.toString() === req.user._id.toString()) {
    res.json(job);
  } else {
    res.status(404).json({ message: "Job not found or not authorized" });
  }
};

// UPDATE job
export const updateJob = async (req, res) => {
  const job = await JobApplication.findById(req.params.id);
  if (job && job.userId.toString() === req.user._id.toString()) {
    Object.assign(job, req.body);
    const updated = await job.save();
    res.json(updated);
  } else {
    res.status(404).json({ message: "Job not found or not authorized" });
  }
};

// DELETE job
export const deleteJob = async (req, res) => {
  const job = await JobApplication.findById(req.params.id);
  if (job && job.userId.toString() === req.user._id.toString()) {
    await job.remove();
    res.json({ message: "Job deleted" });
  } else {
    res.status(404).json({ message: "Job not found or not authorized" });
  }
};
