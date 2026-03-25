const { Job } = require("../models/Job");
const { Application } = require("../models/Application.js");

const createJob = async (req, res) => {
  const { title, companyName, location, description } = req.body;

  if (!title || !location || !companyName || !description) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const job = await Job.create({
    title,
    companyName,
    location,
    description,
    createdBy: req.user._id,
  });

  return res.status(200).json({
    success: true,
    message: "Job created successfully",
  });
};

const getJobs = async (req, res) => {
  const jobs = await Job.find().sort({ postedAt: -1 });
  res.json({ success: true, data: jobs });
};

const applyJob = async (req, res) => {
  await Application.create({
    userId: req.user._id,
    jobId: req.params.id
  });

  res.json({ success: true, message: "Applied successfully" });
};

module.exports = { getJobs, applyJob , createJob };
