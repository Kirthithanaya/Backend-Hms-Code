import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
import { transporter } from "../Database/nodemailer.js";

export const createStripePayment = async (req, res) => {
  const { amount, currency } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // amount in cents
      currency,
    });
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Send Email
export const sendEmail = async (req, res) => {
  const { email, message } = req.body;

  const mailOptions = {
    from: process.env.PASS_MAIL,
    to: email,
    subject: "Hostel Notification",
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to send email", details: err.message });
  }
};
