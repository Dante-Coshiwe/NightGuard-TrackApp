import express from "express";
import { incidentsController } from "../controllers/incidentsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
const router = express.Router();
router.get("/incidents/recent", authMiddleware, roleMiddleware(["guard", "marshal", "admin"]), incidentsController.getRecentIncidents);
router.post("/incidents/report", authMiddleware, roleMiddleware(["guard", "marshal", "admin"]), incidentsController.reportIncident);
export default router;
