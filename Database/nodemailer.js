import nodemailer from 'nodemailer';

export const  transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.PASS_MAIL,
    pass: process.env.PASS_KEY,
  },
});

export const sendEmail = async (to, subject, text) => {
  await transporter.sendMail({
    from: process.env.PASS_MAIL,
    to,
    subject,
    text,
  });
};
