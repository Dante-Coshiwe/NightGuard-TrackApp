import express from "express";
import { wheelClampsController } from "../controllers/wheelClampsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/wheelclamps/recent",
  authMiddleware,
  roleMiddleware(["admin"]),
  wheelClampsController.getRecentClamps
);

export default router;