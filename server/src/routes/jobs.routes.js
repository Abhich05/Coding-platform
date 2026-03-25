const express= require('express');
// import auth from "../middlewares/auth.middleware.js";
const { applyJob, getJobs } = require("../controllers/job.controller.js");


const router = express.Router();

router.get("/", getJobs);
router.post("/:id/apply", applyJob);

module.exports = router;

