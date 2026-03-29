const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { auth, requireAdmin } = require("../middlewares/auth.middleware");
const { createTest, listTests, getTestResults, sendTestLink } = require("../controllers/test.controller");
const { getAdminStats, getAdminOverview } = require("../controllers/admin.controller");

// Protect all admin routes
router.use(auth, requireAdmin);

// Users (exclude admins)
router.get("/users", async (_req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).select("-password");

    res.json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin overview metrics
router.get("/stats", getAdminStats);
router.get("/overview", getAdminOverview);

// Test management
router.post("/tests", createTest);
router.get("/tests", listTests);
router.get("/tests/:testId/results", getTestResults);
router.post("/tests/:testId/send-link", sendTestLink);

module.exports = router;
