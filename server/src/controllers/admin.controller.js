const User = require("../models/User");
const { Job } = require("../models/Job");
const Application = require("../models/Application");
const Test = require("../models/Test");
const TestAttempt = require("../models/TestAttempt");

exports.getAdminStats = async (_req, res) => {
    try {
        const [totalUsers, totalAdmins, jobsCount, applications, testsCount, attempts] = await Promise.all([
            User.countDocuments({ role: "user" }),
            User.countDocuments({ role: "admin" }),
            Job.countDocuments(),
            Application.countDocuments(),
            Test.countDocuments(),
            TestAttempt.countDocuments(),
        ]);

        const recentUsers = await User.find().sort({ createdAt: -1 }).limit(6).select("fullName email role createdAt");

        return res.json({
            success: true,
            data: {
                totals: { totalUsers, totalAdmins, jobsCount, applications, testsCount, attempts },
                recentUsers,
            },
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// Combined overview payload (stats + full user list for admin UI)
exports.getAdminOverview = async (_req, res) => {
    try {
        const [statsRes, users] = await Promise.all([
            exports.getAdminStatsInternal(),
            User.find({ role: { $ne: "" } }).select("-password"),
        ]);

        return res.json({
            success: true,
            data: {
                ...statsRes,
                users,
            },
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// internal helper to reuse stats logic
exports.getAdminStatsInternal = async () => {
    const [totalUsers, totalAdmins, jobsCount, applications, testsCount, attempts] = await Promise.all([
        User.countDocuments({ role: "user" }),
        User.countDocuments({ role: "admin" }),
        Job.countDocuments(),
        Application.countDocuments(),
        Test.countDocuments(),
        TestAttempt.countDocuments(),
    ]);

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(6).select("fullName email role createdAt");

    return { totals: { totalUsers, totalAdmins, jobsCount, applications, testsCount, attempts }, recentUsers };
};
