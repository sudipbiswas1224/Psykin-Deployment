// Mask sensitive values like email/phone before logging or returning
exports.sanitizeMessage = (text) => {
    return text
      .replace(/\b\d{10}\b/g, '[PHONE]')
      .replace(/\b[\w.%+-]+@[\w.-]+\.\w{2,}\b/g, '[EMAIL]');
  };
  
  // Delay utility (for simulating async timing or throttling AI calls)
  exports.sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };
  
  
  // Generate a random string token
  exports.generateToken = (length = 32) => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  };
  