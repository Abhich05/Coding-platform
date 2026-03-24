const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    code: String,
    language: String,
    status: String,
    result: Object,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", SubmissionSchema);
