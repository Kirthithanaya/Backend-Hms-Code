import express from "express";
import {
  createStripePayment,
  sendEmail,
} from "../controllers/integrationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/payment", protect, createStripePayment);
router.post("/send-email", sendEmail);

export default router;
