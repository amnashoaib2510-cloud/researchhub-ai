const Project = require("../models/Project");
const Paper = require("../models/Paper");
const Task = require("../models/Task");

// @desc Get summary stats + chart data for the dashboard
// @route GET /api/analytics/dashboard
// @access Private
const getDashboardAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const projectFilter = { $or: [{ owner: userId }, { "members.user": userId }] };

    const [activeProjects, completedProjects, totalProjects, recentPapers, myTasksOpen] =
      await Promise.all([
        Project.countDocuments({ ...projectFilter, status: "Active" }),
        Project.countDocuments({ ...projectFilter, status: "Completed" }),
        Project.countDocuments(projectFilter),
        Paper.find({ uploadedBy: userId }).sort({ createdAt: -1 }).limit(5),
        Task.countDocuments({ assignedTo: userId, status: { $ne: "Done" } }),
      ]);

    // Monthly upload statistics for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const monthlyUploadsAgg = await Paper.aggregate([
      { $match: { uploadedBy: userId, createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const monthlyUploads = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const match = monthlyUploadsAgg.find(
        (m) => m._id.year === d.getFullYear() && m._id.month === d.getMonth() + 1
      );
      monthlyUploads.push({
        month: monthNames[d.getMonth()],
        uploads: match ? match.count : 0,
      });
    }

    // Research progress across projects
    const projects = await Project.find(projectFilter).select("title progress status");
    const progressChart = projects.map((p) => ({
      title: p.title,
      progress: p.progress,
      status: p.status,
    }));

    res.json({
      stats: {
        activeProjects,
        completedProjects,
        totalProjects,
        openTasks: myTasksOpen,
        totalPapers: await Paper.countDocuments({ uploadedBy: userId }),
      },
      recentPapers,
      monthlyUploads,
      progressChart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get collaboration & productivity report
// @route GET /api/analytics/productivity
// @access Private
const getProductivityReport = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const tasksByStatus = await Task.aggregate([
      { $match: { assignedTo: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const formatted = ["To Do", "In Progress", "Review", "Done"].map((status) => {
      const found = tasksByStatus.find((t) => t._id === status);
      return { status, count: found ? found.count : 0 };
    });

    res.json({ tasksByStatus: formatted });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardAnalytics, getProductivityReport };
