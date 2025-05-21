import express from "express";
import {
  forgotPassword,
  getAllUsers,
  login,
  logout,
  register,
  resetPassword,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

//  (admin only)
router.get("/users", verifyToken, getAllUsers);

router.post("/logout", logout);

export default router;
