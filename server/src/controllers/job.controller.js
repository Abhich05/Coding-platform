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