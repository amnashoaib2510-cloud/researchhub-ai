const nodemailer = require("nodemailer");

// Sends an email via SMTP if credentials are configured, otherwise
// logs the email to the console so the flow can be tested without
// a real mail provider.
const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("----- EMAIL (mock, no SMTP configured) -----");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${html}`);
    console.log("----------------------------------------------");
    return { mocked: true };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
  });

  return info;
};

module.exports = sendEmail;
