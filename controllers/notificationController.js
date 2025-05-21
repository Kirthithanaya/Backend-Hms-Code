// controllers/notificationController.js
import User from "../models/userModel.js";
import Notification from "../models/Notification.js";

export const sendNotification = async (req, res) => {
  const { userId, subject, message, type } = req.body;

  try {
    // Validate
    if (!userId || !subject || !message || !type) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Fetch user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ error: "User object is missing or invalid userId." });
    }

    // Send based on type
    if (type === "email") {
      await sendEmail(user.email, subject, message);
    } else if (type === "sms") {
      await sendSMS(user.phone, message);
    }

    // Save in-app notification
    if (type === "in-app" || type === "email" || type === "sms") {
      const notification = new Notification({
        user: user._id,
        subject,
        message,
        type,
        read: false,
      });
      await notification.save();
    }

    res
      .status(200)
      .json({ success: true, message: "Notification sent successfully." });
  } catch (err) {
    console.error("Error in sendNotification:", err);
    res.status(500).json({ error: "Server error while sending notification." });
  }
};
