const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async (email, token) => {
  try {
    const verifyURL = `${process.env.FRONTEND_URL}/verify/${token}`;

    const response = await resend.emails.send({
      from: "onboarding@resend.dev", // default working sender
      to: email,
      subject: "Verify your PrepTrack Account",
      html: `
        <h2>Welcome to PrepTrack 🚀</h2>
        <p>Click below to verify your email:</p>
        <a href="${verifyURL}">Verify Account</a>
      `,
    });

    console.log("Email sent:", response);
  } catch (err) {
    console.log("MAIL ERROR:", err);
  }
};

module.exports = sendMail;