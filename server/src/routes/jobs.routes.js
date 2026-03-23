const express=require('express');
const router=express.Router();
const {getJobs,applyJob}=require('../controllers/job.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/',getJobs);
router.post('/:id/apply', auth, applyJob);

module.exports=router;