import express from "express";
import { guardController } from "../controllers/guardController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/guard/patrols",
  authMiddleware,
  roleMiddleware(["guard", "marshal"]),
  guardController.getPatrols
);

export default router;