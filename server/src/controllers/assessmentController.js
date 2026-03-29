import Assessment from '../models/Assessment.js';
import Problem from '../models/Problem.js';

// @desc    Create new assessment
// @route   POST /api/v1/assessments
// @access  Private (Recruiter/Admin)
export const createAssessment = async (req, res, next) => {
  try {
    const { title, description, problems, duration, settings, expiresAt } = req.body;

    // Validate required fields
    if (!title || !problems || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, problems, and duration'
      });
    }

    // Verify problems exist
    const problemDocs = await Problem.find({ _id: { $in: problems } });
    if (problemDocs.length !== problems.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more problems not found'
      });
    }

    const assessment = await Assessment.create({
      title,
      description: description || 'No description provided.',
      problems,
      duration,
      settings: settings || {},
      expiresAt,
      createdBy: req.user.id
    });

    await assessment.populate('problems');

    res.status(201).json({
      success: true,
      message: 'Assessment created successfully',
      data: assessment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Candidate starts an assessment (auto-registers them if not already listed)
// @route   POST /api/v1/assessments/:id/start
// @access  Public
export const startAssessment = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    if (assessment.status === 'closed') {
      return res.status(403).json({ success: false, message: 'This assessment is no longer accepting submissions.' });
    }

    // Register candidate if not already in the list
    let candidate = assessment.candidates.find(c => c.email === email.toLowerCase());
    if (!candidate) {
      assessment.candidates.push({ name: name || email, email: email.toLowerCase(), startedAt: new Date() });
      await assessment.save();
    } else if (!candidate.startedAt) {
      candidate.startedAt = new Date();
      await assessment.save();
    }

    res.status(200).json({ success: true, message: 'Assessment started' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get full assessment for a candidate (no auth, requires assessment to be active)
// @route   GET /api/v1/assessments/:id/candidate
// @access  Public
export const getAssessmentForCandidate = async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id)
      .populate('problems');

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    if (assessment.status === 'closed') {
      return res.status(403).json({ success: false, message: 'This assessment is no longer accepting submissions.' });
    }

    res.status(200).json({ success: true, data: assessment });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public assessment info for candidate join page (no auth required)
// @route   GET /api/v1/assessments/:id/public
// @access  Public
export const getAssessmentPublic = async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id)
      .populate('problems', 'title difficulty');

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    if (assessment.status === 'closed') {
      return res.status(403).json({ success: false, message: 'This assessment is no longer accepting submissions.' });
    }

    // Return only the minimal info needed for the join page
    res.status(200).json({
      success: true,
      data: {
        id: assessment._id.toString(),
        title: assessment.title,
        description: assessment.description,
        duration: assessment.duration,
        status: assessment.status,
        problems: assessment.problems.length,
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all assessments
// @route   GET /api/v1/assessments
// @access  Private
export const getAssessments = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { createdBy: req.user.id };
    if (status) query.status = status;

    const assessments = await Assessment.find(query)
      .populate('problems', 'title difficulty language')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Assessment.countDocuments(query);

    res.status(200).json({
      success: true,
      data: assessments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single assessment
// @route   GET /api/v1/assessments/:id
// @access  Private
export const getAssessment = async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id)
      .populate('problems')
      .populate('createdBy', 'name email');

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    // Check if user has access
    if (assessment.createdBy._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this assessment'
      });
    }

    res.status(200).json({
      success: true,
      data: assessment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update assessment
// @route   PUT /api/v1/assessments/:id
// @access  Private
export const updateAssessment = async (req, res, next) => {
  try {
    let assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    // Check ownership
    if (assessment.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this assessment'
      });
    }

    assessment = await Assessment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('problems');

    res.status(200).json({
      success: true,
      message: 'Assessment updated successfully',
      data: assessment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete assessment
// @route   DELETE /api/v1/assessments/:id
// @access  Private
export const deleteAssessment = async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    // Check ownership
    if (assessment.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this assessment'
      });
    }

    await assessment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Assessment deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add candidate to assessment
// @route   POST /api/v1/assessments/:id/candidates
// @access  Private
export const addCandidate = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    // Check if candidate already exists
    const existingCandidate = assessment.candidates.find(c => c.email === email);
    if (existingCandidate) {
      return res.status(400).json({
        success: false,
        message: 'Candidate already added to this assessment'
      });
    }

    assessment.candidates.push({ name, email });
    await assessment.save();

    // TODO: Send invitation email to candidate

    res.status(200).json({
      success: true,
      message: 'Candidate added successfully',
      data: assessment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get assessment statistics
// @route   GET /api/v1/assessments/:id/stats
// @access  Private
export const getAssessmentStats = async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    const stats = {
      totalCandidates: assessment.candidates.length,
      invited: assessment.candidates.filter(c => c.status === 'invited').length,
      inProgress: assessment.candidates.filter(c => c.status === 'in-progress').length,
      completed: assessment.candidates.filter(c => c.status === 'completed').length,
      evaluated: assessment.candidates.filter(c => c.status === 'evaluated').length,
      averageScore: assessment.candidates
        .filter(c => c.score !== null)
        .reduce((sum, c) => sum + c.score, 0) / 
        assessment.candidates.filter(c => c.score !== null).length || 0
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};
