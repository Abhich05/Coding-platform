const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ⭐ Get ONLY normal users (exclude admins)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({
      role: { $ne: "admin" }   // exclude admin
    }).select("-password");

    res.json({
      message: "Users fetched successfully",
      data: users
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

module.exports = router;
