const express = require("express");
const router = express.Router();

const { getJobs, applyJob, createJob } = require("../controllers/job.controller");
const { auth } = require("../middlewares/auth.middleware");

// Routes
router.get("/", getJobs);
router.post("/", auth, createJob);
router.post("/:id/apply", auth, applyJob);

module.exports = router;
