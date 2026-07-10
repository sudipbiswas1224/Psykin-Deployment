const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const recommendationService = require('../services/recommendationService');

// @route   GET /api/recommendations/personalized
// @desc    Get personalized activities/videos/articles based on test scores
// @access  Private
router.get('/personalized', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const recommendations = await recommendationService.getRecommendationsForUser(userId);
        res.status(200).json({ success: true, data: recommendations });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error retrieving recommendations' });
    }
});

module.exports = router;
