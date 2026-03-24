const User = require("../models/User");
const Problem = require("../models/Problem");
const Submission = require("../models/Submission");

exports.getStats = async (userId) => {
  const [totalUsers, totalProblems, mySolved, recentActivity] =
    await Promise.all([
      User.countDocuments(),
      Problem.countDocuments(),
      Submission.countDocuments({ userId, status: "success" }),
      Submission.find({ userId })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("problemId", "title slug category topic"),
    ]);

  return {
    totalUsers,
    totalProblems,
    solvedCount: mySolved,
    activity: recentActivity,
  };
};
