import React, { useState } from "react";
import { Mail, Lock, User, ArrowRight, Calendar, Scale, Ruler, Activity, Clock, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    height: "",
    weight: "",
    fitnessLevel: "Beginner",
    preferences: {
      measurementUnit: "Metric",
      workoutReminders: true,
      preferredWorkoutTime: "morning"
    },
    agreeToTerms: false,
  });

  const { signup } = useAuthStore();

  const fitnessLevels = ["Beginner", "Intermediate", "Advanced"];
  const measurementUnits = ["Metric", "Imperial"];
  const workoutTimes = ["morning", "afternoon", "evening", "night"];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      // Handle nested preferences
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
    if (!formData.age) return toast.error("Please enter your age");
    if (formData.age < 13) return toast.error("You must be at least 13 years old");
    if (formData.age > 120) return toast.error("Please enter a valid age");
    if (formData.password !== formData.confirmPassword) return toast.error("Passwords do not match");
    
    // New validations
    if (!formData.height) return toast.error("Height is required");
    if (!formData.weight) return toast.error("Weight is required");
    if (formData.preferences.measurementUnit === "Metric") {
      if (formData.height < 100 || formData.height > 250) return toast.error("Please enter a valid height in cm (100-250)");
      if (formData.weight < 30 || formData.weight > 300) return toast.error("Please enter a valid weight in kg (30-300)");
    } else {
      if (formData.height < 36 || formData.height > 96) return toast.error("Please enter a valid height in inches (36-96)");
      if (formData.weight < 66 || formData.weight > 660) return toast.error("Please enter a valid weight in lbs (66-660)");
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) signup(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-transparent p-8 rounded-xl shadow-2xl transform transition-all duration-500 hover:scale-[1.01]">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-700 mb-2">Join StrengthStation</h2>
          <p className="text-gray-400">Start your fitness journey today</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Existing fields remain the same */}
            <div className="relative">
              <label className="text-gray-600 text-sm font-medium mb-1 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 w-5 h-5" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-transparent text-white rounded-lg pl-10 pr-4 py-3 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email field remains the same */}
            <div className="relative">
              <label className="text-gray-600 text-sm font-medium mb-1 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-transparent text-white rounded-lg pl-10 pr-4 py-3 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* New Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="text-gray-600 text-sm font-medium mb-1 block">Height</label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 w-5 h-5" />
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-transparent text-white rounded-lg pl-10 pr-4 py-3 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200"
                    placeholder={formData.preferences.measurementUnit === "Metric" ? "Height (cm)" : "Height (in)"}
                  />
                </div>
              </div>

              <div className="relative">
                <label className="text-gray-600 text-sm font-medium mb-1 block">Weight</label>
                <div className="relative">
                  <Scale className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 w-5 h-5" />
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-transparent text-white rounded-lg pl-10 pr-4 py-3 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200"
                    placeholder={formData.preferences.measurementUnit === "Metric" ? "Weight (kg)" : "Weight (lbs)"}
                  />
                </div>
              </div>
            </div>

            <div className="relative">
              <label className="text-gray-600 text-sm font-medium mb-1 block">Fitness Level</label>
              <div className="relative">
                <Activity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 w-5 h-5" />
                <select
                  name="fitnessLevel"
                  value={formData.fitnessLevel}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-transparent text-white rounded-lg pl-10 pr-4 py-3 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200"
                >
                  {fitnessLevels.map(level => (
                    <option key={level} value={level} className="bg-gray-800">{level}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="relative">
              <label className="text-gray-600 text-sm font-medium mb-1 block">Measurement Unit</label>
              <div className="relative">
                <Scale className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 w-5 h-5" />
                <select
                  name="preferences.measurementUnit"
                  value={formData.preferences.measurementUnit}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-transparent text-white rounded-lg pl-10 pr-4 py-3 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200"
                >
                  {measurementUnits.map(unit => (
                    <option key={unit} value={unit} className="bg-gray-800">{unit}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="relative">
              <label className="text-gray-600 text-sm font-medium mb-1 block">Preferred Workout Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 w-5 h-5" />
                <select
                  name="preferences.preferredWorkoutTime"
                  value={formData.preferences.preferredWorkoutTime}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-transparent text-white rounded-lg pl-10 pr-4 py-3 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200"
                >
                  {workoutTimes.map(time => (
                    <option key={time} value={time} className="bg-gray-800">
                      {time.charAt(0).toUpperCase() + time.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="preferences.workoutReminders"
                checked={formData.preferences.workoutReminders}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
              />
              <label className="ml-2 text-sm text-gray-600">
                Enable workout reminders
              </label>
            </div>

            {/* Password fields remain the same */}
            <div className="relative">
              <label className="text-gray-600 text-sm font-medium mb-1 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 w-5 h-5" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-transparent text-white rounded-lg pl-10 pr-4 py-3 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200"
                  placeholder="Create a password"
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-gray-600 text-sm font-medium mb-1 block">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 w-5 h-5" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-transparent text-white rounded-lg pl-10 pr-4 py-3 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200"
                  placeholder="Confirm your password"
                />
              </div>
            </div>
          </div>

          {/* Terms and Submit button remain the same */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              required
              className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-gray-600">
              I agree to the{" "}
              <button type="button" className="text-blue-500 hover:text-blue-400 transition-colors">
                Terms of Service
              </button>{" "}
              and{" "}
              <button type="button" className="text-blue-500 hover:text-blue-400 transition-colors">
                Privacy Policy
              </button>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center group"
          >
            Create Account
            <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-center text-gray-400 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:text-blue-400 transition-colors">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;