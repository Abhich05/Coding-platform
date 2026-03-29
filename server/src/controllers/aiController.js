import aiService from '../services/aiService.js';

// @desc    Generate a coding problem using AI
// @route   POST /api/v1/ai/generate-problem
// @access  Private
export const generateProblem = async (req, res, next) => {
  try {
    const { topic, difficulty, language } = req.body;

    if (!topic || !difficulty || !language) {
      return res.status(400).json({
        success: false,
        message: 'Please provide topic, difficulty, and language',
      });
    }

    const problemData = await aiService.generateProblem(topic, difficulty, language);

    res.status(200).json({
      success: true,
      data: problemData,
    });
  } catch (error) {
    console.error('Generate problem error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate problem',
    });
  }
};

// @desc    Generate test cases for a problem using AI
// @route   POST /api/v1/ai/generate-testcases
// @access  Private
export const generateTestCases = async (req, res, next) => {
  try {
    const { title, description, language, starterCode } = req.body;

    if (!title || !description || !language) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and language',
      });
    }

    const testCases = await aiService.generateTestCases(
      title,
      description,
      language,
      starterCode || ''
    );

    res.status(200).json({
      success: true,
      data: testCases,
    });
  } catch (error) {
    console.error('Generate test cases error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate test cases',
    });
  }
};

// @desc    Enhance problem description using AI
// @route   POST /api/v1/ai/enhance-description
// @access  Private
export const enhanceDescription = async (req, res, next) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a description',
      });
    }

    const enhancedDescription = await aiService.enhanceProblemDescription(description);

    res.status(200).json({
      success: true,
      data: enhancedDescription,
    });
  } catch (error) {
    console.error('Enhance description error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to enhance description',
    });
  }
};
