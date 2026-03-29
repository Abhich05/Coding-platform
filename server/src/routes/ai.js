const express = require('express');
const router = express.Router();
const {
  generateProblem,
  generateTestCases,
  enhanceDescription,
} = require('../controllers/aiController');
const { protect } = require('../middlewares/auth');

router.post('/generate-problem', protect, generateProblem);
router.post('/generate-testcases', protect, generateTestCases);
router.post('/enhance-description', protect, enhanceDescription);

module.exports = router;
