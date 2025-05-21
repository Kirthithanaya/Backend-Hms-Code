import express from "express";
import {
  createResident,
  deleteResident,
  getAllResidents,
  updateResident,
} from "../controllers/residentController.js";
import { admin, isAuthenticated } from "../middleware/authMiddleware.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();
// POST /api/resident/create
router.post("/create", isAuthenticated, admin, createResident);

// Get all residents (Admin only)
router.get("/all", isAuthenticated, admin, getAllResidents);

// Admin Update Resident
router.put("/update", isAuthenticated, admin, updateResident);
//Admin Delete Resident
router.delete("/delete/:id", verifyToken, deleteResident);

export default router;
