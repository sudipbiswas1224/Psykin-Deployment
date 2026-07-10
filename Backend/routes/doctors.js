const express = require('express');
const router = express.Router();
const { fetchNearbyDoctors, refreshNearbyDoctors } = require('../controllers/doctorController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/nearby', fetchNearbyDoctors);
router.post('/nearby', refreshNearbyDoctors);

module.exports = router;