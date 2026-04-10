import express from "express";
import { sitesController } from "../controllers/sitesController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/sites", authMiddleware, roleMiddleware(["admin"]), sitesController.getAllSites);
router.get("/sites/mine", authMiddleware, roleMiddleware(["admin"]), sitesController.getMySite);
router.put("/sites/mine", authMiddleware, roleMiddleware(["admin"]), sitesController.updateMySite);

export default router;
