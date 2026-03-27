import express from "express";
import { devicesController } from "../controllers/devicesController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/devices",
  authMiddleware,
  roleMiddleware(["admin"]),
  devicesController.getAllDevices
);

export default router;