import User from "../models/User.js";
import Problem from "../models/Problem.js";
import Submission from "../models/Submission.js";

export const getStats = async (userId) => {
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
