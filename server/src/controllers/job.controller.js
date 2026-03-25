const { Job } = require("../models/Job");
const { Application } = require("../models/Application");

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

module.exports = { getJobs, applyJob };
