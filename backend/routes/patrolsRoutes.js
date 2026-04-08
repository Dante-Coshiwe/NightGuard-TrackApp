import express from "express";
import { patrolsController } from "../controllers/patrolsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
const router = express.Router();
router.get("/patrols/summary", authMiddleware, roleMiddleware(["admin"]), patrolsController.getPatrolSummary);
router.get("/patrols", authMiddleware, roleMiddleware(["guard", "marshal", "admin"]), patrolsController.getGuardPatrols);
export default router;
