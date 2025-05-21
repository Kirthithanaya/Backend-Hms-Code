import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.PASS_MAIL,
      pass: process.env.PASS_KEY,
    },
  });

  await transporter.sendMail({
    from: `"Hostel Management" <${process.env.PASS_MAIL}>`,
    to,
    subject,
    html,
  });
};
