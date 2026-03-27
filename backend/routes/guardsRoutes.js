import express from "express";
import { guardsController } from "../controllers/guardsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/guards/on-duty",
  authMiddleware,
  roleMiddleware(["admin"]),
  guardsController.getGuardsOnDuty
);

export default router;