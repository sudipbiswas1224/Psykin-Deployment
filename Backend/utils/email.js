const nodemailer = require('nodemailer');
const axios = require('axios');
const logger = require('./logger');

/**
 * Sends an email using one of three strategies (in priority order):
 * 1. Brevo HTTP API   — works on Render/cloud, free 300 emails/day, any recipient
 * 2. Nodemailer SMTP  — works locally with Gmail
 * 3. Console simulation — fallback if nothing is configured
 */
const sendEmail = async (options) => {
  const {
    BREVO_API_KEY,
    EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_SECURE, EMAIL_FROM
  } = process.env;

  // === Strategy 1: Brevo HTTP API (recommended for production/Render) ===
  if (BREVO_API_KEY) {
    try {
      const senderEmail = EMAIL_USER || 'noreply@psykin.com';
      const senderName = 'Psykin Companion';

      const response = await axios.post(
        'https://api.brevo.com/v3/smtp/email',
        {
          sender: { name: senderName, email: senderEmail },
          to: [{ email: options.email }],
          subject: options.subject,
          textContent: options.message
        },
        {
          headers: {
            'api-key': BREVO_API_KEY,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      logger.info(`Email sent via Brevo to ${options.email}. Message ID: ${response.data.messageId}`);
      return;
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message;
      logger.error(`Brevo send failed for ${options.email}: ${errMsg}`);
      throw new Error(errMsg);
    }
  }

  // === Strategy 2: Nodemailer SMTP (works locally with Gmail) ===
  if (EMAIL_HOST && EMAIL_USER && EMAIL_PASS) {
    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: parseInt(EMAIL_PORT, 10) || 587,
      secure: EMAIL_SECURE === 'true',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      },
      family: 4
    });

    const mailOptions = {
      from: EMAIL_FROM || `"Psykin Companion" <${EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      logger.info(`Email sent via SMTP to ${options.email}. Message ID: ${info.messageId}`);
      return;
    } catch (err) {
      logger.error(`SMTP error for ${options.email}:`, err.message);
      throw err;
    }
  }

  // === Strategy 3: Console simulation (no email config at all) ===
  logger.warn('No email provider configured (BREVO_API_KEY or SMTP). Falling back to console simulation.');
  console.log('\n=================== ✉️ SIMULATED EMAIL ===================');
  console.log(`To:      ${options.email}`);
  console.log(`Subject: ${options.subject}`);
  console.log('---------------------------- CONTENT ----------------------------');
  console.log(options.message);
  console.log('===========================================================\n');
};

module.exports = sendEmail;
