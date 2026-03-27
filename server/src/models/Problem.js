const mongoose = require("mongoose");

const ProblemSchema = new mongoose.Schema(
  {
    title: String,
    slug: { type: String, unique: true },
    category: String,
    topic: String,
    difficulty: Number,
    statement: String,
    examples: Array,
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Problem", ProblemSchema);
