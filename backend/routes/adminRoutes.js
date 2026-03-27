import express from "express";
import { adminController } from "../controllers/adminController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Admin dashboard routes
router.get(
  "/admin/dashboard",
  authMiddleware,
  roleMiddleware(["admin"]),
  adminController.getGeneralDashboard
);

export default router;