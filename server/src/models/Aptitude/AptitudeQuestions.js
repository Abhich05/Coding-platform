import mongoose from "mongoose";

const AptitudeQuestionSchema = new mongoose.Schema({
  question: String,

  options: {
    type: Map,
    of: String
  },

  correct_answer: String,   // backend only

  topic: String,
  difficulty: Number,
  explanation: String
});

export default mongoose.model("AptitudeQuestion", AptitudeQuestionSchema);
