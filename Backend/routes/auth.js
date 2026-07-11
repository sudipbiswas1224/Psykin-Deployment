const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, resetPassword } = require('../controllers/authController');
const { validateUserRegistration, validateLogin, validateForgotPassword, validateResetPassword } = require('../middleware/validation');

router.post('/register', validateUserRegistration, register);
router.post('/login', validateLogin, login);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password/:token', validateResetPassword, resetPassword);

module.exports = router;
