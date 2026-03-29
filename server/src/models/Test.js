const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema(
  {
    prompt: { type: String, required: true },

    options: {
      type: [String],
      validate: [
        (val) => Array.isArray(val) && val.length >= 2,
        "At least two options are required",
      ],
      required: true,
    },

    answer: { type: String, required: true },

    // ⭐ NEW FIELD
    marks: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  { _id: false }
);

const TestSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true,
      uppercase: true,
      trim: true,
    },

    title: { type: String, required: true },

    durationMinutes: { type: Number, default: 30 },

    // ⭐ totalMarks will now be auto-calculated in controller
    totalMarks: {
      type: Number,
      default: 0,
    },

    questions: {
      type: [QuestionSchema],
      default: [],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Test", TestSchema);
