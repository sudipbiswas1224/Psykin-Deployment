const nodemailer = require('nodemailer');
const logger = require('./logger');

/**
 * Sends a real email using Nodemailer if SMTP configuration is present in the environment variables.
 * Otherwise, falls back to logging the simulated email to the console.
 */
const sendEmail = async (options) => {
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_SECURE, EMAIL_FROM } = process.env;

  // Fallback to console simulation if SMTP config is missing
  if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) {
    logger.warn('SMTP environment variables (EMAIL_HOST, EMAIL_USER, EMAIL_PASS) are not set. Falling back to console simulation.');
    console.log('\n=================== ✉️ SIMULATED EMAIL ===================');
    console.log(`To:      ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log('---------------------------- CONTENT ----------------------------');
    console.log(options.message);
    console.log('===========================================================\n');
    return;
  }

  // 1) Create an SMTP transporter
  const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: parseInt(EMAIL_PORT, 10) || 587,
    secure: EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  });

  // 2) Define the mail configuration
  const mailOptions = {
    from: EMAIL_FROM || `"Psykin Companion" <${EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  // 3) Send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent successfully to ${options.email}. Message ID: ${info.messageId}`);
  } catch (err) {
    logger.error(`Error sending email to ${options.email}:`, err.message);
    throw err;
  }
};

module.exports = sendEmail;
