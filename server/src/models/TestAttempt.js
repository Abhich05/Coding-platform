const mongoose = require("mongoose");

const AttemptSchema = new mongoose.Schema(
    {
        testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        respondentName: { type: String },
        respondentEmail: { type: String },
        answers: [{ type: String }],
        score: { type: Number, default: 0 },
        totalMarks: { type: Number, default: 0 },
        durationSeconds: { type: Number, default: 0 },
    },
    { timestamps: true }
);

module.exports = mongoose.model("TestAttempt", AttemptSchema);
