import express from "express";
import { docketsController } from "../controllers/docketsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/dockets/recent",
  authMiddleware,
  roleMiddleware(["admin"]),
  docketsController.getRecentDockets
);

export default router;