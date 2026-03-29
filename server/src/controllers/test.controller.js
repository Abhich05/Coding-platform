const Test = require("../models/Test");
const TestAttempt = require("../models/TestAttempt");

const generateTestCode = async () => {
  for (let i = 0; i < 5; i += 1) {
    const code = `TST${Math.floor(1000 + Math.random() * 9000)}`;
    const existing = await Test.findOne({ code });
    if (!existing) return code;
  }
  throw new Error("Unable to generate unique test code");
};

exports.createTest = async (req, res) => {
  try {
    const { title, durationMinutes, questions, code } = req.body;

    if (!title || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Title and at least one question are required",
      });
    }

    // Normalize + include marks
    const normalizedQuestions = questions.map((q) => ({
      prompt: q.question || q.prompt,
      options: q.options || [],
      answer: q.answer,
      marks: Number(q.marks) || 1, // ⭐ default 1
    }));

    // ⭐ AUTO CALCULATE TOTAL MARKS
    const calculatedTotalMarks = normalizedQuestions.reduce(
      (sum, q) => sum + q.marks,
      0
    );

    const testCode = code?.toUpperCase() || (await generateTestCode());

    const newTest = await Test.create({
      code: testCode,
      title,
      durationMinutes: durationMinutes || 30,
      totalMarks: calculatedTotalMarks, // ⭐ NOT manual anymore
      questions: normalizedQuestions,
      createdBy: req.user?._id,
    });

    const shareUrl = `${
      process.env.APP_URL || "http://localhost:5173"
    }/test/${newTest.code}`;

    return res.status(201).json({
      success: true,
      data: { ...newTest.toObject(), shareUrl },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.listTests = async (_req, res) => {
  try {
    const tests = await Test.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: tests });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTestByCode = async (req, res) => {
  try {
    const test = await Test.findOne({
      code: req.params.code.toUpperCase(),
    });

    if (!test) {
      return res
        .status(404)
        .json({ success: false, message: "Test not found" });
    }

    // Do not expose correct answers
    const safeTest = {
      _id: test._id,
      code: test.code,
      title: test.title,
      durationMinutes: test.durationMinutes,
      totalMarks: test.totalMarks,
      questions: test.questions.map((q) => ({
        prompt: q.prompt,
        options: q.options,
        marks: q.marks, // optional: show weight
      })),
    };

    return res.json({ success: true, data: safeTest });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.submitTest = async (req, res) => {
  try {
    const {
      answers = [],
      durationSeconds = 0,
      respondentName,
      respondentEmail,
    } = req.body;

    const test = await Test.findOne({
      code: req.params.code.toUpperCase(),
    });

    if (!test) {
      return res
        .status(404)
        .json({ success: false, message: "Test not found" });
    }

    let score = 0;

    // ⭐ PROPER MARKS BASED SCORING
    test.questions.forEach((q, idx) => {
      if (answers[idx] && answers[idx] === q.answer) {
        score += q.marks || 1;
      }
    });

    const attempt = await TestAttempt.create({
      testId: test._id,
      userId: req.user?._id,
      respondentName: respondentName || req.user?.fullName,
      respondentEmail: respondentEmail || req.user?.email,
      answers,
      score,
      totalMarks: test.totalMarks, // ⭐ consistent
      durationSeconds,
    });

    return res.status(201).json({ success: true, data: attempt });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTestResults = async (req, res) => {
  try {
    const testId = req.params.testId;

    const attempts = await TestAttempt.find({ testId })
      .sort({ createdAt: -1 })
      .populate("userId", "email fullName role");

    const summary = {
      attempts: attempts.length,
      averageScore:
        attempts.length === 0
          ? 0
          : attempts.reduce((acc, curr) => acc + curr.score, 0) /
            attempts.length,
      maxScore: Math.max(0, ...attempts.map((a) => a.score)),
    };

    return res.json({ success: true, data: { attempts, summary } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.sendTestLink = async (req, res) => {
  try {
    const { testId } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Recipient email is required",
      });
    }

    const test = await Test.findById(testId);
    if (!test) {
      return res
        .status(404)
        .json({ success: false, message: "Test not found" });
    }

    const shareUrl = `${
      process.env.APP_URL || "http://localhost:5173"
    }/test/${test.code}`;

    const { sendMail } = require("../utils/mailer");

    await sendMail({
      to: email,
      subject: `Invitation to take test ${test.title}`,
      html: `
        <p>You have been invited to take a test.</p>
        <p><strong>Title:</strong> ${test.title}</p>
        <p><strong>Link:</strong> <a href="${shareUrl}">${shareUrl}</a></p>
      `,
    });

    return res.json({
      success: true,
      message: "Test link sent",
      data: { shareUrl },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
