import express from "express";
import { authController } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/auth/login", authController.login);
router.post("/auth/register", authController.register);
router.get("/auth/me", authMiddleware, authController.getMe);
router.post("/auth/logout", authMiddleware, authController.logout);
router.post("/auth/guard-login", authController.guardLogin);
router.post("/auth/guard-logout", authMiddleware, authController.guardLogout);
// Also add a route to get guards list for login screen (no auth needed)
router.get("/auth/guards/:site_id", authController.getGuardsBySite);

export default router;
