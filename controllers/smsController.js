import { client } from "../Database/twilio.js";

export const sendSMS = async (req, res) => {
  const { to, body } = req.body;

  try {
    await client.messages.create({
      body,
      to,
      from: process.env.TWILIO_PHONE_NUMBER,
    });

    res.status(200).json({ success: true, message: "SMS sent successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
