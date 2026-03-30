import mongoose from 'mongoose';
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

const Application=mongoose.model('Application',applicationSchema);
export default Application;
