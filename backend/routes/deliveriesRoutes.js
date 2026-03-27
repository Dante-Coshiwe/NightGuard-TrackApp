import express from "express";
import { deliveriesController } from "../controllers/deliveriesController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/deliveries/recent",
  authMiddleware,
  roleMiddleware(["admin"]),
  deliveriesController.getRecentDeliveries
);

export default router;