import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a problem title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a problem description']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  language: {
    type: String,
    enum: ['javascript', 'python', 'java', 'cpp', 'csharp', 'typescript'],
    // Optional — a problem can support multiple languages via starterCode object
  },
  // starterCode can be a plain string (legacy) or an object keyed by language:
  // { javascript: '...', python: '...', java: '...', cpp: '...' }
  starterCode: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  solution: {
    type: String,
    select: false // Don't return solution by default
  },
  testCases: [{
    input: {
      type: String,
      required: true
    },
    expectedOutput: {
      type: String,
      required: true
    },
    isHidden: {
      type: Boolean,
      default: false
    }
  }],
  examples: [{
    input: {
      type: String,
      required: true
    },
    output: {
      type: String,
      required: true
    },
    explanation: {
      type: String
    }
  }],
  constraintsList: [{
    type: String
  }],
  constraints: {
    timeLimit: {
      type: Number,
      default: 1000 // milliseconds
    },
    memoryLimit: {
      type: Number,
      default: 128 // MB
    }
  },
  hints: [{
    type: String
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for better search performance
problemSchema.index({ title: 'text', description: 'text', tags: 'text' });
problemSchema.index({ difficulty: 1 });
problemSchema.index({ language: 1 });

// Transform _id to id for JSON responses
problemSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    
    // Transform testCases _id to id
    if (ret.testCases) {
      ret.testCases = ret.testCases.map(tc => {
        if (tc._id) {
          tc.id = tc._id.toString();
          delete tc._id;
        }
        return tc;
      });
    }
    
    // Transform examples _id to id
    if (ret.examples) {
      ret.examples = ret.examples.map(ex => {
        if (ex._id) {
          ex.id = ex._id.toString();
          delete ex._id;
        }
        return ex;
      });
    }
    
    // Map constraintsList to constraints for frontend compatibility
    if (ret.constraintsList && ret.constraintsList.length > 0) {
      ret.constraints = ret.constraintsList;
      delete ret.constraintsList;
    } else {
      // Keep constraints object if constraintsList is empty
      ret.constraints = ret.constraints || { timeLimit: 1000, memoryLimit: 128 };
    }
    
    return ret;
  }
});

export default mongoose.model('Problem', problemSchema);
