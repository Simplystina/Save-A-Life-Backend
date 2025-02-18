
const nodemailer = require("nodemailer");

async function sendVerificationEmail(user, verificationLink) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    to: user.email,
    subject: "Welcome to Save A Life - Email Verification",
    html: `
      <h2 style="color:blue" >Welcome to Save A Life Blood Donation App</h2>
      <p>Dear ${user.firstName},</p>
      <p>Thank you for registering an account with Save a Life. To verify your email address and activate your account, please use the otp given:</p>
      <a href=${verificationLink}>${verificationLink}</a>
      <p>Please note that the verification link will expire after 1 hour.</p>
      <p>If you did not register for an account with Save A Life, please disregard this email.</p>
      <p>Best regards,</p>
      <p>Developed by Dinma</p>
    `,
  };
  await transporter.sendMail(mailOptions);
}

module.exports = {
    sendVerificationEmail
}