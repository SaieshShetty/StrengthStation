import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['Strength', 'Cardio', 'HIIT', 'Yoga', 'Recovery'],
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 15,
    max: 180
  },
  preferredTime: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'biweekly', 'monthly'],
    default: 'weekly'
  },
  intensity: {
    type: String,
    enum: ['light', 'medium', 'high'],
    required: true
  },
  equipment: {
    type: String,
    enum: ['minimal', 'moderate', 'full-gym'],
    required: true
  },
  days: {
    type: [String],
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    validate: {
      validator: function(days) {
        return days.length > 0;
      },
      message: 'At least one day must be selected'
    }
  },
  notes: {
    type: String,
    maxlength: 500
  },
  completed: [{
    date: {
      type: Date,
      required: true
    },
    notes: String,
    performance: {
      type: String,
      enum: ['poor', 'fair', 'good', 'excellent']
    }
  }]
}, {
  timestamps: true
});

// Virtual property to check if there are completed sessions for this activity
ScheduleSchema.virtual('hasCompletedSessions').get(function() {
  return this.completed.length > 0;
});

// Method to add a completed session
ScheduleSchema.methods.addCompletedSession = function(date, notes, performance) {
  this.completed.push({
    date: date || new Date(),
    notes,
    performance
  });
  return this.save();
};

// Static method to find scheduling conflicts
ScheduleSchema.statics.findConflicts = async function(userId, days, preferredTime, excludeSessionId = null) {
  const query = {
    user: mongoose.Types.ObjectId(userId),
    days: { $in: days },
    preferredTime: preferredTime
  };
  
  if (excludeSessionId) {
    query._id = { $ne: mongoose.Types.ObjectId(excludeSessionId) };
  }
  
  return this.find(query);
};

// Index for efficient querying
ScheduleSchema.index({ user: 1, days: 1 });

const Schedule = mongoose.model('Schedule', ScheduleSchema);

export default Schedule;