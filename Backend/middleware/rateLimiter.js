const rateLimit = require('express-rate-limit');

// General rate limiter for APIs
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});

// Chat message limiter
exports.chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: 'You are sending messages too fast. Please slow down.'
});
