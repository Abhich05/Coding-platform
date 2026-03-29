import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['invited', 'in-progress', 'completed', 'evaluated'],
    default: 'invited'
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  },
  submittedAt: {
    type: Date,
    default: null
  },
  timeSpent: {
    type: Number, // in minutes
    default: null
  },
  invitedAt: {
    type: Date,
    default: Date.now
  },
  startedAt: {
    type: Date,
    default: null
  }
});

const assessmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an assessment title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide an assessment description']
  },
  problems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  }],
  duration: {
    type: Number,
    required: [true, 'Please provide assessment duration'],
    min: [15, 'Duration must be at least 15 minutes']
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'closed'],
    default: 'draft'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  candidates: [candidateSchema],
  settings: {
    allowCopyPaste: {
      type: Boolean,
      default: false
    },
    allowTabSwitch: {
      type: Boolean,
      default: false
    },
    showResults: {
      type: Boolean,
      default: true
    },
    randomizeProblems: {
      type: Boolean,
      default: false
    }
  },
  expiresAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for better query performance
assessmentSchema.index({ status: 1, createdBy: 1 });
assessmentSchema.index({ 'candidates.email': 1 });

// Transform _id to id for JSON responses
assessmentSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    // Transform candidate _id to id as well
    if (ret.candidates) {
      ret.candidates = ret.candidates.map(c => {
        if (c._id) {
          c.id = c._id.toString();
          delete c._id;
        }
        return c;
      });
    }
    return ret;
  }
});

export default mongoose.model('Assessment', assessmentSchema);
