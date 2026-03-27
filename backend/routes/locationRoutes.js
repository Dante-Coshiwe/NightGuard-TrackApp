import express from "express";
import { locationController } from "../controllers/locationController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/location/dashboard",
  authMiddleware,
  roleMiddleware(["admin"]),
  locationController.getDashboard
);

export default router;