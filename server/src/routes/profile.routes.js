const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth.middleware");
const { getMe, updateProfile } = require("../controllers/profile.controller");

router.get("/me", auth, getMe);
router.put("/update", auth, updateProfile);

module.exports = router;
