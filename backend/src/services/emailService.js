const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send email function
const sendEmail = async ({ to, subject, html, text }) => {
  // If email not configured, log instead of sending
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('📧 Email not configured. Would have sent:');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content: ${text || html?.substring(0, 100)}`);
    return { success: true, messageId: 'not-configured' };
  }

  try {
    const transporter = createTransporter();

    const info = await transporter.sendMail({
      from: `"ShopNear - Indian Local Commerce" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email error:', error.message);
    // Don't throw - just log and continue
    return { success: false, error: error.message };
  }
};

// Send bulk emails
const sendBulkEmails = async (emails) => {
  const results = await Promise.allSettled(
    emails.map((email) => sendEmail(email))
  );

  const successful = results.filter((r) => r.status === 'fulfilled' && r.value.success).length;
  const failed = results.length - successful;

  return { successful, failed, total: results.length };
};

module.exports = { sendEmail, sendBulkEmails };
