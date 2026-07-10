const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { validateUserRegistration, validateLogin } = require('../middleware/validation');

router.post('/register', validateUserRegistration, register);
router.post('/login', validateLogin, login);

module.exports = router;
