import mongoose from "mongoose";

const AttemptSchema = new mongoose.Schema({
  userId: String,
  answers: Object,
  score: Number,
  totalQuestions: Number,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("AptitudeAttempt", AttemptSchema);
