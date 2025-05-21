import express from "express";
import {
  assignRequest,
  createMaintenanceRequest,
  deleteRequest,
  getAllRequests,
  getMyMaintenanceRequests,
  updateRequestStatus,
} from "../controllers/maintenanceController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

//TResident create requset
router.post("/create", protect, createMaintenanceRequest);

// Get requests submitted by the logged-in resident
router.get("/my-requests", protect, getMyMaintenanceRequests);

// Admin Get all maintenance requests
router.get("/all", protect, admin, getAllRequests);
// Admin assigns request
router.put("/assign", protect, admin, assignRequest);
//Admin update request
router.put("/update-status", protect, admin, updateRequestStatus);
// Admin deleteRequset

router.delete("/delete", protect, admin, deleteRequest);
export default router;
