import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    // New fields for fitness tracking
    height: {
      type: Number,
      default: 0,
    },
    weight: {
      type: Number,
      default: 0,
    },
    fitnessLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner'
    },
    preferences: {
      measurementUnit: {
        type: String,
        enum: ['Metric', 'Imperial'],
        default: 'Metric'
      },
      workoutReminders: {
        type: Boolean,
        default: true
      },
      preferredWorkoutTime: {
        type: String,
        default: 'morning'
      }
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User",UserSchema);

export default User ;