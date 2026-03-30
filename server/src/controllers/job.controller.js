import { Job } from '../models/Job.js';
import Application from '../models/Application.js';

async function getJobs(req, res) {
    try {
        const jobs = await Job.find().sort({ postedAt: -1 });

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
        const userId = req.user.id || req.user._id;
        const existingApplication = await Application.findOne({
            userId,
            jobId
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: "You have already applied for this job."
            });
        }
        await Application.create({
            userId,
            jobId,
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

async function createJob(req, res) {
    try {
        const { title, company, location, description, tags } = req.body;

        const newJob = await Job.create({
            title,
            company,
            location,
            description,
            tags,
        });

        return res.status(201).json({
            success: true,
            data: newJob,
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: "Unable to create job",
        });
    }
}

export { getJobs, applyJob, createJob };
