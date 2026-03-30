import express from "express";
import User from "../models/User.js";
import { auth, requireAdmin } from "../middlewares/auth.middleware.js";
import { createTest, listTests, getTestResults, sendTestLink } from "../controllers/test.controller.js";
import { getAdminStats, getAdminOverview } from "../controllers/admin.controller.js";

const router = express.Router();

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

export default router;
