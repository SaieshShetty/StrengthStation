import Schedule from "../models/schedule.model.js";
import mongoose from "mongoose";

export const getSchedule = async (req, res) => {
  try {
    const userId = req.user._id; // Using _id instead of id to match the goal controller pattern
    const schedule = await Schedule.find({ user: userId }).sort({ preferredTime: 1 });
    
    res.status(200).json(schedule);
  } catch (error) {
    console.error("Error fetching schedule:", error);
    res.status(500).json({ 
      message: "Error fetching schedule", 
      error: error.message 
    });
  }
};

export const getScheduleItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid session ID" });
    }
    
    const scheduleItem = await Schedule.findOne({ 
      _id: id, 
      user: req.user._id 
    });
    
    if (!scheduleItem) {
      return res.status(404).json({ message: "Schedule item not found" });
    }
    
    res.status(200).json(scheduleItem);
  } catch (error) {
    console.error("Error fetching schedule item:", error);
    res.status(500).json({ 
      message: "Error fetching schedule item", 
      error: error.message 
    });
  }
};

export const createScheduleItem = async (req, res) => {
  try {
    const {
      type,
      duration,
      preferredTime,
      frequency,
      intensity,
      equipment,
      days,
      notes
    } = req.body;
    
    // Validate required fields
    if (!type || !duration || !preferredTime || !intensity || !equipment || !days || days.length === 0) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    // Check for scheduling conflicts
    const conflicts = await Schedule.findConflicts(req.user._id, days, preferredTime);
    
    if (conflicts.length > 0) {
      return res.status(409).json({ 
        message: "Scheduling conflict detected",
        conflicts: conflicts.map(c => ({
          id: c._id,
          type: c.type,
          day: days.find(day => c.days.includes(day)),
          time: c.preferredTime
        }))
      });
    }
    
    const newScheduleItem = new Schedule({
      user: req.user._id,
      type,
      duration,
      preferredTime,
      frequency: frequency || "weekly",
      intensity,
      equipment,
      days,
      notes
    });
    
    await newScheduleItem.validate();
    const savedScheduleItem = await newScheduleItem.save();
    
    res.status(201).json(savedScheduleItem);
  } catch (error) {
    console.error("Error creating schedule item:", error);
    
    if (error.name === "ValidationError") {
      return res.status(400).json({ 
        message: "Invalid schedule data", 
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({ 
      message: "Error creating schedule item", 
      error: error.message 
    });
  }
};

export const updateScheduleItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid session ID" });
    }
    
    // Check if the session exists and belongs to the user
    const existingSession = await Schedule.findOne({ 
      _id: id, 
      user: req.user._id 
    });
    
    if (!existingSession) {
      return res.status(404).json({ message: "Schedule item not found" });
    }
    
    const {
      type,
      duration,
      preferredTime,
      frequency,
      intensity,
      equipment,
      days,
      notes
    } = req.body;
    
    // Check for scheduling conflicts if time or days changed
    if ((preferredTime && preferredTime !== existingSession.preferredTime) || 
        (days && JSON.stringify(days) !== JSON.stringify(existingSession.days))) {
      
      const conflicts = await Schedule.findConflicts(
        req.user._id,
        days || existingSession.days,
        preferredTime || existingSession.preferredTime,
        id
      );
      
      if (conflicts.length > 0) {
        return res.status(409).json({ 
          message: "Scheduling conflict detected",
          conflicts: conflicts.map(c => ({
            id: c._id,
            type: c.type,
            day: (days || existingSession.days).find(day => c.days.includes(day)),
            time: preferredTime || existingSession.preferredTime
          }))
        });
      }
    }
    
    const updatedSession = await Schedule.findByIdAndUpdate(
      id,
      {
        type: type || existingSession.type,
        duration: duration || existingSession.duration,
        preferredTime: preferredTime || existingSession.preferredTime,
        frequency: frequency || existingSession.frequency,
        intensity: intensity || existingSession.intensity,
        equipment: equipment || existingSession.equipment,
        days: days || existingSession.days,
        notes: notes !== undefined ? notes : existingSession.notes
      },
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedSession);
  } catch (error) {
    console.error("Error updating schedule item:", error);
    
    if (error.name === "ValidationError") {
      return res.status(400).json({ 
        message: "Invalid schedule data", 
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({ 
      message: "Error updating schedule item", 
      error: error.message 
    });
  }
};

export const deleteScheduleItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid session ID" });
    }
    
    const scheduleItem = await Schedule.findOne({ 
      _id: id, 
      user: req.user._id 
    });
    
    if (!scheduleItem) {
      return res.status(404).json({ message: "Schedule item not found" });
    }
    
    await Schedule.findByIdAndDelete(id);
    
    res.status(200).json({ message: "Schedule item deleted successfully" });
  } catch (error) {
    console.error("Error deleting schedule item:", error);
    res.status(500).json({ 
      message: "Error deleting schedule item", 
      error: error.message 
    });
  }
};

export const addCompletedSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, notes, performance } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid session ID" });
    }
    
    const session = await Schedule.findOne({ 
      _id: id, 
      user: req.user._id 
    });
    
    if (!session) {
      return res.status(404).json({ message: "Schedule item not found" });
    }
    
    // Add the completed session
    await session.addCompletedSession(
      date ? new Date(date) : new Date(),
      notes,
      performance
    );
    
    res.status(200).json(session);
  } catch (error) {
    console.error("Error adding completed session:", error);
    
    if (error.name === "ValidationError") {
      return res.status(400).json({ 
        message: "Invalid completed session data", 
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({ 
      message: "Error adding completed session", 
      error: error.message 
    });
  }
};

export const getWorkoutStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get total workouts by type
    const workoutsByType = await Schedule.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Get completed sessions count
    const completedSessions = await Schedule.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },
      { $unwind: "$completed" },
      { $count: "total" }
    ]);
    
    // Get completion rate by workout type
    const completionRates = await Schedule.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },
      {
        $project: {
          type: 1,
          completedCount: { $size: "$completed" },
          scheduleCount: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$type",
          totalCompleted: { $sum: "$completedCount" },
          totalScheduled: { $sum: "$scheduleCount" }
        }
      },
      {
        $project: {
          type: "$_id",
          completionRate: {
            $multiply: [
              { $divide: ["$totalCompleted", { $max: ["$totalScheduled", 1] }] },
              100
            ]
          }
        }
      }
    ]);
    
    res.status(200).json({
      workoutsByType,
      totalCompletedSessions: completedSessions.length > 0 ? completedSessions[0].total : 0,
      completionRates
    });
  } catch (error) {
    console.error("Error fetching workout stats:", error);
    res.status(500).json({ 
      message: "Error fetching workout statistics", 
      error: error.message 
    });
  }
};