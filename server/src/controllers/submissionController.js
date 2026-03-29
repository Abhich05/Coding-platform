import Submission from '../models/Submission.js';
import Assessment from '../models/Assessment.js';
import Problem from '../models/Problem.js';
import { submissionQueue } from '../services/submissionQueue.js';
import { nanoid } from 'nanoid';

// @desc    Submit code for a problem
// @route   POST /api/v1/submissions
// @access  Public (Candidates)
export const submitCode = async (req, res, next) => {
  try {
    const { assessmentId, candidateEmail, problemId, code, language, runOnly = false } = req.body;

    // Verify assessment exists
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    // Verify candidate is invited
    const candidate = assessment.candidates.find(c => c.email === candidateEmail);
    if (!candidate) {
      return res.status(403).json({
        success: false,
        message: 'Candidate not invited to this assessment'
      });
    }

    // Get problem with test cases
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    // Find or create submission
    let submission = await Submission.findOne({
      assessment: assessmentId,
      'candidate.email': candidateEmail,
      problem: problemId
    });

    if (!submission) {
      submission = await Submission.create({
        assessment: assessmentId,
        candidate: {
          email: candidateEmail,
          name: candidate.name
        },
        problem: problemId,
        submissions: [],
        status: 'in-progress'
      });
    }

    // Generate unique submission ID
    const submissionId = nanoid();

    // Add submission to history
    submission.submissions.push({
      code,
      language,
      submittedAt: new Date(),
      submissionId
    });

    submission.status = 'in-progress';
    await submission.save();

    // Add to execution queue
    // runOnly: only execute visible test cases (for "Run" button)
    const testCasesToRun = runOnly
      ? problem.testCases.filter(tc => !tc.isHidden)
      : problem.testCases;

    await submissionQueue.add(
      `submission_${submissionId}`,
      {
        submissionId,
        submissionMongoId: submission._id.toString(),
        assessmentId,
        candidateEmail,
        problemId,
        code,
        language,
        testCases: testCasesToRun,
        timeLimit: 2000,
        memoryLimit: 128,
        runOnly,
      },
      {
        jobId: submissionId,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Code submitted successfully, executing...',
      data: {
        submissionId,
        submissionMongoId: submission._id.toString(),
        status: 'queued'
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get submission result by ID
// @route   GET /api/v1/submissions/result/:submissionMongoId
// @access  Public (Candidates)
export const getSubmissionResult = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.submissionMongoId);
    
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        status: submission.status,
        testResults: submission.testResults,
        score: submission.score,
        passedTests: submission.passedTests,
        totalTests: submission.totalTests
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get candidate's submissions for an assessment
// @route   GET /api/v1/submissions/assessment/:assessmentId/candidate/:email
// @access  Public (Candidates) / Private (Recruiters)
export const getCandidateSubmissions = async (req, res, next) => {
  try {
    const { assessmentId, email } = req.params;

    const submissions = await Submission.find({
      assessment: assessmentId,
      'candidate.email': email
    }).populate('problem', 'title difficulty');

    res.status(200).json({
      success: true,
      data: submissions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all submissions for an assessment
// @route   GET /api/v1/submissions/assessment/:assessmentId
// @access  Private (Recruiters/Admin)
export const getAssessmentSubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find({
      assessment: req.params.assessmentId
    }).populate('problem', 'title difficulty');

    res.status(200).json({
      success: true,
      data: submissions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Complete assessment for candidate
// @route   POST /api/v1/submissions/complete
// @access  Public (Candidates)
export const completeAssessment = async (req, res, next) => {
  try {
    const { assessmentId, candidateEmail, timeSpent } = req.body;

    // Update assessment candidate status
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    const candidate = assessment.candidates.find(c => c.email === candidateEmail);
    if (!candidate) {
      return res.status(403).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    candidate.status = 'completed';
    candidate.submittedAt = new Date();
    candidate.timeSpent = timeSpent;

    // Calculate overall score
    const submissions = await Submission.find({
      assessment: assessmentId,
      'candidate.email': candidateEmail,
      status: { $ne: 'in-progress' }
    });

    if (submissions.length > 0) {
      const totalScore = submissions.reduce((sum, sub) => sum + sub.score, 0);
      candidate.score = Math.round(totalScore / submissions.length);
    }

    await assessment.save();

    res.status(200).json({
      success: true,
      message: 'Assessment completed successfully',
      data: {
        score: candidate.score,
        timeSpent: candidate.timeSpent
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Track suspicious activity
// @route   POST /api/v1/submissions/flag
// @access  Public (Candidates)
export const flagActivity = async (req, res, next) => {
  try {
    const { assessmentId, candidateEmail, problemId, activityType } = req.body;

    const submission = await Submission.findOne({
      assessment: assessmentId,
      'candidate.email': candidateEmail,
      problem: problemId
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    if (activityType === 'tabSwitch') {
      submission.flags.tabSwitches += 1;
    } else if (activityType === 'copyPaste') {
      submission.flags.copyPasteAttempts += 1;
    }

    if (submission.flags.tabSwitches > 5 || submission.flags.copyPasteAttempts > 3) {
      submission.flags.suspiciousActivity = true;
    }

    await submission.save();

    res.status(200).json({
      success: true,
      message: 'Activity recorded'
    });
  } catch (error) {
    next(error);
  }
};
