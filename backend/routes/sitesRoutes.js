import express from "express";
import { sitesController } from "../controllers/sitesController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/sites",
  authMiddleware,
  roleMiddleware(["admin"]),
  sitesController.getAllSites
);

export default router;