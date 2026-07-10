const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');
const { authenticate } = require('../middleware/auth');

// List available test types
router.get('/tests/list', authenticate, assessmentController.listTests);
// Fetch a specific test template
router.get('/tests/:type', authenticate, assessmentController.getTestTemplate);

module.exports = router;
