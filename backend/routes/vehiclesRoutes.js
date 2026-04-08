import express from "express";
import { vehiclesController } from "../controllers/vehiclesController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/vehicles/recent", authMiddleware, roleMiddleware(["guard", "marshal", "admin"]), vehiclesController.getRecentVehicles);
router.post("/vehicles/entry", authMiddleware, roleMiddleware(["guard", "marshal", "admin"]), vehiclesController.createEntry);

router.get("/vehicles/report", authMiddleware, roleMiddleware(["admin"]), vehiclesController.getReport);
router.patch("/vehicles/:id/exit", authMiddleware, roleMiddleware(["guard", "marshal", "admin"]), vehiclesController.markExit);
router.patch("/vehicles/:id/exit", authMiddleware, roleMiddleware(["guard", "marshal", "admin"]), vehiclesController.markExit);
export default router;
