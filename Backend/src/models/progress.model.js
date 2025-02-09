import mongoose from "mongoose";

const ProgressSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    goalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Goal",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    value: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
    },
    metrics: {
      weight: Number,
      reps: Number,
      distance: Number,
      duration: Number,
      calories: Number,
    },
  },
  { timestamps: true }
);

const Progress = mongoose.model("Progress", ProgressSchema);

export default Progress;
