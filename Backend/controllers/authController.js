const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sanitizeMessage } = require('../utils/helpers');
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const sendEmail = require('../utils/email');

// Generate JWT
const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Register new user
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMsg = errors.array().map(e => e.msg).join(", ");
    return res.status(400).json({ success: false, error: errorMsg, errors: errors.array() });
  }

  try {
    const { email, password, displayName } = req.body;
    console.log("📥 Incoming register request:", req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.warn("⚠️ Email already registered:", email);
      return res.status(400).json({ success: false, error: 'Email already in use' });
    }

    const user = await User.create({
      email,
      password,
      profile: { displayName }
    });

    console.log("✅ User created:", user.email);

    const token = createToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        displayName: user.profile.displayName,
        email: user.email,
        profile: user.profile,
        preferences: user.preferences
      }
    });
  } catch (err) {
    console.error("❌ Registration error:", err.message);
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
};

// User login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("📥 Login attempt:", email);

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.warn("❌ User not found:", email);
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.warn("❌ Incorrect password for:", email);
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    console.log("✅ Login successful:", email);

    const token = createToken(user._id);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        displayName: user.profile.displayName,
        email: user.email,
        profile: user.profile,
        preferences: user.preferences
      }
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
};

// Forgot password handler
exports.forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMsg = errors.array().map(e => e.msg).join(", ");
    return res.status(400).json({ success: false, error: errorMsg, errors: errors.array() });
  }

  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found with this email' });
    }

    // Generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Send email (simulated)
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    const message = `Forgot your password? Reset it here:\n\n${resetUrl}\n\nThis link is valid for 10 minutes. If you did not make this request, please ignore this email.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Token (Psykin Companion)',
        message
      });

      res.status(200).json({
        success: true,
        message: 'Password reset link sent (simulated). Please check the backend console logs!'
      });
    } catch (err) {
      user.security.passwordResetToken = undefined;
      user.security.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      console.error("❌ Failed to send simulated reset email:", err);
      return res.status(500).json({ success: false, error: 'There was an error sending the email. Try again later.' });
    }
  } catch (err) {
    console.error("❌ Forgot password error:", err.message);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Reset password handler
exports.resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMsg = errors.array().map(e => e.msg).join(", ");
    return res.status(400).json({ success: false, error: errorMsg, errors: errors.array() });
  }

  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      'security.passwordResetToken': hashedToken,
      'security.passwordResetExpires': { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, error: 'Token is invalid or has expired' });
    }

    // Set new password
    user.password = password;
    user.security.passwordResetToken = undefined;
    user.security.passwordResetExpires = undefined;
    
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful! You can now log in with your new password.'
    });
  } catch (err) {
    console.error("❌ Reset password error:", err.message);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
