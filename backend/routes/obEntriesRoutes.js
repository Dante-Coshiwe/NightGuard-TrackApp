import express from "express";
import { obEntriesController } from "../controllers/obEntriesController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/obentries/recent",
  authMiddleware,
  roleMiddleware(["guard", "marshal", "admin"]),
  obEntriesController.getRecentEntries
);

router.post(
  "/obentries/create",
  authMiddleware,
  roleMiddleware(["guard", "marshal", "admin"]),
  obEntriesController.create
);

export default router;
