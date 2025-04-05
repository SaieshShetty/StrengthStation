import express from 'express';
import {
  getSchedule,
  getScheduleItem,
  createScheduleItem,
  updateScheduleItem,
  deleteScheduleItem,
  addCompletedSession,
  getWorkoutStats
} from '../controllers/schedule.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protectRoute);

// Fetch all schedule items for a user - changing to match how the frontend is calling it
router.get("/fetchschedule/:userId", getSchedule);

// Get a single schedule item
router.get("/scheduleitem/:id", getScheduleItem);

// Add a new schedule item
router.post("/addschedule", createScheduleItem);

// Update a schedule item
router.put("/updateschedule/:id", updateScheduleItem);

// Delete a schedule item
router.delete("/removeschedule/:id", deleteScheduleItem);

// Add completed session record
router.patch("/:id/complete", addCompletedSession);

// Get workout statistics
router.get("/stats/summary", getWorkoutStats);

export default router;