import express from "express";
import {
  createExpense,
  createPayment,
  getExpenses,
  getMonthlyTrends,
  getOverviewReport,
  getPayments,
} from "../controllers/financialController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/payment", protect, admin, createPayment);
router.get("/payments", protect, admin, getPayments);

router.post("/expense", protect, admin, createExpense);
router.get("/expenses", protect, admin, getExpenses);

router.get("/overview", protect, admin, getOverviewReport);
router.get("/trends", protect, admin, getMonthlyTrends);

export default router;
