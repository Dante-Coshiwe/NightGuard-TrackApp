import express from "express";
import { pedestriansController } from "../controllers/pedestriansController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/pedestrians/recent",
  authMiddleware,
  roleMiddleware(["admin"]),
  pedestriansController.getRecentPedestrians
);

export default router;