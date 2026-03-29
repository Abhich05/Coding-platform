import Problem from '../models/Problem.js';

// @desc    Create new problem
// @route   POST /api/v1/problems
// @access  Private (Recruiter/Admin)
export const createProblem = async (req, res, next) => {
  try {
    const problem = await Problem.create({
      ...req.body,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Problem created successfully',
      data: problem
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all problems
// @route   GET /api/v1/problems
// @access  Private
export const getProblems = async (req, res, next) => {
  try {
    const { difficulty, language, tags, search, page = 1, limit = 20 } = req.query;

    const query = {
      $or: [
        { createdBy: req.user.id },
        { isPublic: true }
      ]
    };

    if (difficulty) query.difficulty = difficulty;
    if (language) query.language = language;
    if (tags) query.tags = { $in: tags.split(',') };
    if (search) {
      query.$text = { $search: search };
    }

    const problems = await Problem.find(query)
      .select('-solution') // Don't return solution
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Problem.countDocuments(query);

    res.status(200).json({
      success: true,
      data: problems,
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

// @desc    Get single problem
// @route   GET /api/v1/problems/:id
// @access  Private
export const getProblem = async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.id)
      .select('-solution'); // Don't return solution

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    // Check if user has access
    if (problem.createdBy.toString() !== req.user.id && !problem.isPublic && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this problem'
      });
    }

    res.status(200).json({
      success: true,
      data: problem
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update problem
// @route   PUT /api/v1/problems/:id
// @access  Private
export const updateProblem = async (req, res, next) => {
  try {
    let problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    // Check ownership
    if (problem.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this problem'
      });
    }

    problem = await Problem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-solution');

    res.status(200).json({
      success: true,
      message: 'Problem updated successfully',
      data: problem
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete problem
// @route   DELETE /api/v1/problems/:id
// @access  Private
export const deleteProblem = async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    // Check ownership
    if (problem.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this problem'
      });
    }

    await problem.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Problem deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
