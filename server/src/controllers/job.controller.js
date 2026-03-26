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
const jobModel = require('../models/Job');
const applicationModel = require('../models/Application');

async function getJobs(req, res) {
    try {
        const jobs = await jobModel.find().sort({ postedAt: -1 });
        
        return res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: "Unable to fetch jobs"
        });
    }
}
async function applyJob(req, res) {
    try {
        const { id: jobId } = req.params;
        const userId = req.user.id;
        const existingApplication = await applicationModel.findOne({
            userId: userId,
            jobId: jobId
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: "You have already applied for this job."
            });
        }
        await applicationModel.create({
            userId: userId,
            jobId: jobId,
        });

        return res.status(201).json({ 
            success: true, 
            message: "Applied successfully" 
        });
        
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: "Application failed due to a server error"
        });
    }
}

module.exports = { getJobs, applyJob };
