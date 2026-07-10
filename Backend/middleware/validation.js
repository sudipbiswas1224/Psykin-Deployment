const { body, param } = require('express-validator');

exports.validateChatMessage = [
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ max: 5000 }).withMessage('Message is too long'),

  body('conversationId')
    .optional()
    .isMongoId().withMessage('Invalid conversation ID')
];

exports.validateUserRegistration = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Min 8 characters required for password'),
  body('displayName').notEmpty().withMessage('Display name required')
];

exports.validateLogin = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required')
];

exports.validateConversationId = [
  param('conversationId').isMongoId().withMessage('Invalid conversation ID')
];

exports.validateProfileUpdate = [
  body('displayName').optional().trim().notEmpty().withMessage('Display name cannot be empty'),
  body('avatar').optional().trim().isString().withMessage('Avatar must be a string'),
  body('timezone').optional().trim().isString().withMessage('Timezone must be a string'),
  body('theme').optional().isIn(['light', 'dark', 'auto']).withMessage('Theme must be light, dark, or auto'),
  body('language').optional().trim().isString().withMessage('Language must be a string')
];

exports.validateChangePassword = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters long')
];
