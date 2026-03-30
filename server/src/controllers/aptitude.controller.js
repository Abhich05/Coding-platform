import AptitudeQuestion from "../models/Aptitude/AptitudeQuestions.js";
import AptitudeAttempt from "../models/Aptitude/Attempt.js";

export const getQuestions = async (req, res) => {
  try {
    const questions = await AptitudeQuestion.find();

    const safeData = questions.map(q => ({
      id: q._id,
      question: q.question,
      options: q.options,
      topic: q.topic,
      difficulty: q.difficulty
    }));

    res.json(safeData);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch questions", err });
  }
};

export const submitAnswers = async (req, res) => {
  try {
    const { userId, answers } = req.body;

    const questions = await AptitudeQuestion.find();
    let score = 0;

    questions.forEach((q, index) => {
      if (answers[index] === q.correct_answer) score++;
    });

    const attempt = await AptitudeAttempt.create({
      userId,
      answers,
      score,
      totalQuestions: questions.length
    });

    res.json({
      score,
      total: questions.length,
      attemptId: attempt._id
    });

  } catch (err) {
    res.status(500).json({ message: "Failed to submit answers", err });
  }
};