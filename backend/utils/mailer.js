const nodemailer = require('nodemailer');
require('dotenv').config();

if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.error('❌ SMTP credentials missing from environment variables');
  throw new Error('Missing SMTP credentials in environment variables');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP configuration error:', error.message);
  } else {
    console.log('✅ SMTP server is ready to send emails');
  }
});

async function sendFeedbackMail({ name, email, message }) {
  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: process.env.FEEDBACK_RECEIVER,
    subject: "New Feedback from Algo-Vision",
    text: message,
    html: `<p><b>Name:</b> ${name}</p>\n<p><b>Email:</b> ${email}</p>\n<p><b>Message:</b><br/>${message}</p>`
  };
  return transporter.sendMail(mailOptions);
}

module.exports = { sendFeedbackMail };
