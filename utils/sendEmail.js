import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.PASS_MAIL,
      pass: process.env.PASS_KEY, // App password, not regular Gmail password
    },
  });

  await transporter.sendMail({
    from: `"Hostel Admin" <${process.env.PASS_MAIL}>`,
    to,
    subject,
    html,
  });
};

export default sendEmail;
