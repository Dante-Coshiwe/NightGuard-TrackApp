import express from "express";
import { nfcController } from "../controllers/nfcController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Guard scans a tag
router.post("/nfc/scan", authMiddleware, roleMiddleware(["guard", "marshal", "admin"]), nfcController.logScan);

// Admin registers a tag as a checkpoint
router.post("/nfc/register", authMiddleware, roleMiddleware(["admin"]), nfcController.registerTag);

// Get all checkpoints for site
router.get("/nfc/checkpoints", authMiddleware, roleMiddleware(["guard", "marshal", "admin"]), nfcController.getCheckpoints);

// Get scans for current shift
router.get("/nfc/scans", authMiddleware, roleMiddleware(["guard", "marshal", "admin"]), nfcController.getScans);

export default router;
