const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');
const { authenticate } = require('../middleware/auth');

// List available assessments
// api/assessment/tests
router.get('/tests', authenticate, assessmentController.listTests);

// Get a specific test template (questions/choices) by type
// GET /api/assessment/template/:type
router.get('/template/:type', authenticate, assessmentController.getTestTemplate);

// Submit assessment
// POST /api/assessment/submit
router.post('/submit', authenticate, assessmentController.submitAssessment);

// Get user assessment history
// GET /api/assessment/history/:userId
router.get('/history/:userId', authenticate, assessmentController.getHistory);

// Get user progress for a test type
// GET /api/assessment/:userId/:testType
// router.get('/:userId/:testType', authenticate, assessmentController.getProgress);

router.get('/analytics/:userId', authenticate, assessmentController.getAnalytics);
module.exports = router;
