import express from "express";
import { vehiclesController } from "../controllers/vehiclesController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/vehicles/recent",
  authMiddleware,
  roleMiddleware(["admin"]),
  vehiclesController.getRecentVehicles
);

export default router;