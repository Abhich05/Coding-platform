const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  description: String,
  tags: [String],
  postedAt: { type: Date, default: Date.now }
});

<<<<<<< feature/auth-and-overview
const  jobModel=mongoose.model('Job', JobSchema);

module.exports=jobModel;
=======
const Job = mongoose.model("Job", JobSchema);

module.exports = { Job };
>>>>>>> main
