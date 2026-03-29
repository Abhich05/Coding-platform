import mongoose from 'mongoose';

const codeSubmissionSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  executionTime: {
    type: Number // in milliseconds
  },
  memoryUsed: {
    type: Number // in MB
  }
});

const submissionSchema = new mongoose.Schema({
  assessment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true
  },
  candidate: {
    email: {
      type: String,
      required: true,
      lowercase: true
    },
    name: {
      type: String,
      required: true
    }
  },
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  submissions: [codeSubmissionSchema],
  finalSubmission: {
    code: String,
    language: String
  },
  testResults: [{
    testCaseIndex: Number,
    testId: String,        // original test case ID from Problem
    passed: Boolean,
    actualOutput: String,
    expectedOutput: String,
    executionTime: Number,
    isHidden: Boolean,
    error: String
  }],
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  passedTests: {
    type: Number,
    default: 0
  },
  totalTests: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['in-progress', 'submitted', 'evaluated'],
    default: 'in-progress'
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  flags: {
    tabSwitches: {
      type: Number,
      default: 0
    },
    copyPasteAttempts: {
      type: Number,
      default: 0
    },
    suspiciousActivity: {
      type: Boolean,
      default: false
    }
  },
  feedback: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for better query performance
submissionSchema.index({ assessment: 1, 'candidate.email': 1, problem: 1 });
submissionSchema.index({ status: 1 });

// Transform _id to id for JSON responses
submissionSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    // Transform submissions array _id to id
    if (ret.submissions) {
      ret.submissions = ret.submissions.map(s => {
        if (s._id) {
          s.id = s._id.toString();
          delete s._id;
        }
        return s;
      });
    }
    return ret;
  }
});

export default mongoose.model('Submission', submissionSchema);
