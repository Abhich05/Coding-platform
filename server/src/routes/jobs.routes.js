const express= require('express');
// import auth from "../middlewares/auth.middleware.js";
const { applyJob, getJobs, createJob } = require("../controllers/job.controller.js");
const { protect, authorize } = require('../middlewares/auth.middleware.js');


const router = express.Router();

router.post("/", protect, authorize("admin"), createJob)
router.get("/", getJobs);
router.post("/:id/apply", protect, applyJob);

module.exports = router;

