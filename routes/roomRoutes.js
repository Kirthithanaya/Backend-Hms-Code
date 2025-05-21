import express from "express";
import {
  assignRoom,
  checkInRoom,
  checkOutRoom,
  createRoom,
  deleteRoom,
  getAllRoomCheckIns,
  getAllRooms,
  getAllRoomsForResident,
} from "../controllers/roomController.js";
import {
  admin,
  authenticateToken,
  isAuthenticated,
  protect,
} from "../middleware/authMiddleware.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

//Admin CreateRoom
router.post("/create", createRoom);

//Admin GetAllRoom
router.get("/all", getAllRooms);

// Resident GetAllRoom
router.get("/available", getAllRoomsForResident);

//residet CheckIn Room
router.post("/checkin", authenticateToken, checkInRoom);

//Get Admin Al checkIN
router.get("/admin/room-checkins", isAuthenticated, getAllRoomCheckIns);

// Only authenticated admins can assign rooms
router.post("/assign", protect, admin, assignRoom);

//resident CheckOut Room
router.put("/checkout", protect, checkOutRoom);

//Admin Delete Room
// DELETE room by roomNumber (admin only)
router.delete("/delete/:roomNumber", verifyToken, admin, deleteRoom);

export default router;
