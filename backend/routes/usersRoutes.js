import express from "express";
import { usersController } from "../controllers/usersController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/users/guards", authMiddleware, roleMiddleware(["admin"]), usersController.getGuards);
router.post("/users/guards", authMiddleware, roleMiddleware(["admin"]), usersController.addGuard);
router.patch("/users/guards/:id/pin", authMiddleware, roleMiddleware(["admin"]), usersController.updatePin);
router.patch("/users/guards/:id/toggle", authMiddleware, roleMiddleware(["admin"]), usersController.toggleActive);

export default router;
