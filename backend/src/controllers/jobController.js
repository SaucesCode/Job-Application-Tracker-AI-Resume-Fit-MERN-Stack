import JobApplication from "../models/JobApplication.js";
import mongoose from "mongoose";

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
    await job.deleteOne();
    res.json({ message: "Job deleted" });
  } else {
    res.status(404).json({ message: "Job not found or not authorized" });
  }
};

export const getJobStats = async (req, res) => {
  const userId = req.user._id;
  const now = new Date();

  const { from, to } = req.query;
  const startDate = from ? new Date(from) : new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = to ? new Date(to) : new Date();

  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  try {
    const total = await JobApplication.countDocuments({ userId });

    const thisMonth = await JobApplication.countDocuments({
      userId,
      createdAt: { $gte: startOfThisMonth },
    });

    const lastMonth = await JobApplication.countDocuments({
      userId,
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    });

    const percentChange =
      lastMonth === 0 ? 100 : (((thisMonth - lastMonth) / lastMonth) * 100).toFixed(1);

    const statusBreakdown = await JobApplication.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const statusCounts = statusBreakdown.reduce((acc, cur) => {
      acc[cur._id] = cur.count;
      return acc;
    }, {});

    // ✅ Daily Trend
    const dailyAgg = await JobApplication.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const dailyCounts = [];
    let current = new Date(startDate);
    while (current <= endDate) {
      const dateStr = current.toISOString().split("T")[0];
      const found = dailyAgg.find(d => d._id === dateStr);
      dailyCounts.push({ date: dateStr, count: found ? found.count : 0 });
      current.setDate(current.getDate() + 1);
    }

    // ✅ Weekly Trend Aggregation (for bar chart)
    const weeklyAgg = await JobApplication.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            $isoWeek: "$createdAt", // group by ISO week number
          },
          applications: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const weeklyTrend = weeklyAgg.map(week => ({
      week: `Week ${week._id}`,
      applications: week.applications,
      interviews: Math.floor(week.applications * 0.3), // 💡 fake data for interviews
    }));

    // You can improve interview count later if you store it separately

    res.json({
      total,
      thisMonth,
      lastMonth,
      percentChange,
      statusCounts,
      dailyCounts,
      weeklyTrend, // ✅ Now returned to frontend
    });
  } catch (error) {
    console.error("Error in getJobStats:", error);
    res.status(500).json({ message: "Server error fetching stats" });
  }
};
