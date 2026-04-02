import express from "express";
import { wheelClampsController } from "../controllers/wheelClampsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/wheelclamps/recent",
  authMiddleware,
  roleMiddleware(["admin"]),
  wheelClampsController.getRecentClamps
);
// Shifts
export const getActiveShift = () => api.get('/shifts/active').then(res => res.data);
export const getGuardsList = () => api.get('/shifts/guards').then(res => res.data);
export const startShift = (data) => api.post('/shifts/start', data).then(res => res.data);
export const endShift = (data) => api.post('/shifts/end', data).then(res => res.data);

export default router;