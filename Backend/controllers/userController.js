const { validationResult } = require('express-validator');
const User = require('../models/User');
const Journal = require('../models/Journal');
const Assessment = require('../models/Assessment');
const AssessmentResult = require('../models/AssessmentResult');
const CrisisEvent = require('../models/CrisisEvent');
const Message = require('../models/message');

// Get profile & preferences of the authenticated user
exports.getProfile = async (req, res, next) => {
  try {
    // The authenticate middleware already loaded the user in req.user (excluding password)
    // But we re-fetch just in case we need latest DB sync
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        profile: user.profile,
        preferences: user.preferences,
        stats: user.stats,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

// Update profile and preferences
exports.updateProfile = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMsg = errors.array().map(e => e.msg).join(", ");
    return res.status(400).json({ success: false, error: errorMsg, errors: errors.array() });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const { displayName, avatar, timezone, theme, language } = req.body;

    // Update profile fields if provided
    if (displayName !== undefined) user.profile.displayName = displayName;
    if (avatar !== undefined) user.profile.avatar = avatar;
    if (timezone !== undefined) user.profile.timezone = timezone;

    // Update preferences fields if provided
    if (theme !== undefined) user.preferences.theme = theme;
    if (language !== undefined) user.preferences.language = language;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user._id,
        email: user.email,
        profile: user.profile,
        preferences: user.preferences,
        stats: user.stats,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

// Change user password
exports.changePassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMsg = errors.array().map(e => e.msg).join(", ");
    return res.status(400).json({ success: false, error: errorMsg, errors: errors.array() });
  }

  try {
    const { currentPassword, newPassword } = req.body;

    // Fetch user with password selected for comparison
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Incorrect current password' });
    }

    // Update password (pre-save hook will hash it automatically)
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (err) {
    next(err);
  }
};

// Delete user account & all linked data (cascading delete)
exports.deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Perform cascade deletes
    await Journal.deleteMany({ userId });
    await Assessment.deleteMany({ userId });
    await AssessmentResult.deleteMany({ userId });
    await CrisisEvent.deleteMany({ userId });
    await Message.deleteMany({ user: userId });

    // Finally delete the user document
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: 'Account and all associated data deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};
