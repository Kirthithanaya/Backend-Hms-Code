import express from "express";
import {
  deleteInvoice,
  generateInvoice,
  getAllInvoices,
  getMyInvoices,
  getPaymentHistory,
  processPayment,
} from "../controllers/billingController.js";
import {
  admin,
  authenticateToken,
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin only route to create invoice
router.post("/create", protect, admin, generateInvoice);

//Admin Get All Invoices
router.get("/invoices", protect, admin, getAllInvoices);

// GET /billing/my-invoices (resident only)
router.get("/my-invoices", protect, getMyInvoices);

//  Resident processes payment
router.post("/process", processPayment);

//Resident Get Payment History
router.get("/history", protect, getPaymentHistory);

// Admin Delete Invoice Route
router.post("/admin/delete-invoice", authenticateToken, admin, deleteInvoice);
export default router;
