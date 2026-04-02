import express from "express";
import { shiftsController } from "../controllers/shiftsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/shifts/active",
  authMiddleware,
  roleMiddleware(["guard", "marshal", "admin"]),
  shiftsController.getActiveShift
);

router.get(
  "/shifts/guards",
  authMiddleware,
  roleMiddleware(["guard", "marshal", "admin"]),
  shiftsController.getGuardsList
);

router.post(
  "/shifts/start",
  authMiddleware,
  roleMiddleware(["guard", "marshal", "admin"]),
  shiftsController.startShift
);

router.post(
  "/shifts/end",
  authMiddleware,
  roleMiddleware(["guard", "marshal", "admin"]),
  shiftsController.endShift
);

export default router;