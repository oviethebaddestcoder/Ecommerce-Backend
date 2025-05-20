const nodemailer = require('nodemailer');

async function sendEmail(to_email, subject, html) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Chizzy Caps" <${process.env.EMAIL_USER}>`,
    to: to_email,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
