const nodemailer = require("nodemailer");

const sendMail = async (email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ CREATE LINK HERE (IMPORTANT)
    const verifyURL = `${process.env.FRONTEND_URL}/verify/${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your PrepTrack Account",
      html: `
        <h2>Welcome to PrepTrack 🚀</h2>
        <p>Click below to verify your email:</p>
        <a href="${verifyURL}" style="color:blue;font-size:18px;">
          Verify Account
        </a>
      `,
    });

    console.log("Email sent successfully");
  } catch (err) {
    console.log("MAIL ERROR:", err);
  }
};

module.exports = sendMail;