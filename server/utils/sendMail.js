const nodemailer = require("nodemailer");

const sendMail = async (email, token) => {
  try {
    // 🔥 CREATE TEST ACCOUNT
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const verifyURL = `${process.env.FRONTEND_URL}/verify/${token}`;

    const info = await transporter.sendMail({
      from: '"PrepTrack" <no-reply@preptrack.com>',
      to: email,
      subject: "Verify your PrepTrack Account",
      html: `
        <h2>Welcome to PrepTrack 🚀</h2>
        <p>Click below to verify your email:</p>
        <a href="${verifyURL}">Verify Account</a>
      `,
    });

    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.log("MAIL ERROR:", err);
  }
};

module.exports = sendMail;