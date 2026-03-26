const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "job",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

const Application = mongoose.model("Application", applicationSchema);

module.exports = {
  Application,
  applicationSchema,
};
const mongoose=require('mongoose');
const applicationSchema=new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
        required: true
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'accepted', 'rejected'],
        default: 'pending' 
    },
    appliedAt: {
        type: Date,
        default: Date.now 
    }
})

const applicationModel=mongoose.model('Application',applicationSchema);
module.exports=applicationModel;
