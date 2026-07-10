const express = require('express');
const { getProfile, updateProfile, changePassword, deleteAccount } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const { validateProfileUpdate, validateChangePassword } = require('../middleware/validation');

const router = express.Router();

// Protect all routes with JWT authenticate middleware
router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', validateProfileUpdate, updateProfile);
router.put('/change-password', validateChangePassword, changePassword);
router.delete('/delete-account', deleteAccount);

module.exports = router;
