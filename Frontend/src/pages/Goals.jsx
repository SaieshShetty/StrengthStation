import React, { useState, useEffect } from "react";
import {
  PieChart,
  LineChart,
  Line,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Plus,
  X,
  CheckCircle2,
  Circle,
  Medal,
  Bell,
  Calendar,
  Flag,
  CheckCheck,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../Components/card";
import useGoalsStore from "../store/useGoalsStore";
import { Toaster } from "react-hot-toast";

const Goals = () => {
  // Get state and actions from Zustand store
  const {
    goals,
    isLoading,
    error,
    fetchGoals,
    addGoal,
    updateGoal,
    deleteGoal,
    updateGoalProgress,
    getCompletionStats,
  } = useGoalsStore();

  // Local form state
  const [newGoal, setNewGoal] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Strength");
  const [selectedPriority, setSelectedPriority] = useState("Medium");
  const [targetDate, setTargetDate] = useState("");
  const [progressTarget, setProgressTarget] = useState("");
  const [progressUnit, setProgressUnit] = useState("reps");
  
  // Fetch goals on component mount
  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const categories = ["Strength", "Cardio", "Nutrition", "Flexibility"];
  const priorities = ["Low", "Medium", "High"];
  const statuses = ["Not Started", "In Progress", "Completed", "Archived"];

  // Get stats for charts from the Zustand store
  const { totalGoals, completedGoals, completionRate } = getCompletionStats();

  const pieData = [
    { name: "Completed", value: completedGoals },
    { name: "Pending", value: totalGoals - completedGoals },
  ];

  const COLORS = {
    Completed: "#9ee6a1",
    Pending: "#ff9800",
    High: "#ef4444",
    Medium: "#f59e0b",
    Low: "#10b981",
  };

  const progressData = goals.map((goal) => ({
    name: goal.text.substring(0, 20) + "...",
    progress: (goal.progress.current / goal.progress.target) * 100,
  }));

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!newGoal.trim() || !progressTarget) {
      return; // Toast will be handled by the store
    }

    try {
      await addGoal({
        text: newGoal,
        category: selectedCategory,
        priority: selectedPriority,
        status: "Not Started",
        progress: {
          current: 0,
          target: Number(progressTarget),
          unit: progressUnit,
        },
        targetDate: targetDate ? new Date(targetDate) : null,
      });
      
      // Reset form
      setNewGoal("");
      setProgressTarget("");
    } catch (error) {
      console.error("Error adding goal:", error);
    }
  };

  const handleUpdateProgress = async (id, newProgress) => {
    try {
      await updateGoalProgress(id, {
        current: Math.min(Number(newProgress), 
          goals.find(g => g._id === id).progress.target)
      });
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateGoal(id, { status: newStatus });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleAddReminder = async (id, message) => {
    try {
      const goal = goals.find(g => g._id === id);
      const updatedReminders = [
        ...goal.reminders,
        {
          date: new Date(),
          message,
          isRead: false,
        }
      ];
      
      await updateGoal(id, { reminders: updatedReminders });
    } catch (error) {
      console.error("Error adding reminder:", error);
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      await deleteGoal(id);
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <Toaster position="bottom-right" />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Fitness Goals Tracker</h1>
        
        {/* Loading state */}
        {isLoading && <div className="text-center py-4">Loading goals...</div>}
        {error && <div className="text-center py-4 text-red-500">{error}</div>}
        
        {/* Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Goal Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Individual Goal Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={progressData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="progress" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Add Goal Form */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <form onSubmit={handleAddGoal} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Enter your new goal..."
                  className="input input-bordered w-full"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  disabled={isLoading}
                />
                <select
                  className="select select-bordered w-full"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  disabled={isLoading}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  className="select select-bordered w-full"
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  disabled={isLoading}
                >
                  {priorities.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>

                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Target"
                    className="input input-bordered w-full"
                    value={progressTarget}
                    onChange={(e) => setProgressTarget(e.target.value)}
                    disabled={isLoading}
                  />
                  <input
                    type="text"
                    placeholder="Unit"
                    className="input input-bordered w-full"
                    value={progressUnit}
                    onChange={(e) => setProgressUnit(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-full"
                disabled={isLoading}
              >
                <Plus className="w-5 h-5" /> Add Goal
              </button>
            </form>
          </CardContent>
        </Card>

        {/* Goals List */}
        <Card>
          <CardHeader>
            <CardTitle>Current Goals</CardTitle>
          </CardHeader>
          <CardContent>
            {!isLoading && goals.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No goals yet. Add some goals to get started!
              </div>
            ) : (
              <div className="space-y-4">
                {goals.map((goal) => (
                  <div
                    key={goal._id}
                    className={`p-4 rounded-lg border ${
                      goal.completed
                        ? "bg-green-50 border-green-200"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Flag
                            className={`w-5 h-5 ${
                              goal.priority === "High"
                                ? "text-red-500"
                                : goal.priority === "Medium"
                                ? "text-yellow-500"
                                : "text-green-500"
                            }`}
                          />
                          <h3 className="text-lg font-semibold">{goal.text}</h3>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="badge badge-primary">
                            {goal.category}
                          </span>
                          <span className="badge badge-secondary">
                            {goal.status}
                          </span>
                          {goal.targetDate && (
                            <span className="badge badge-ghost">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(goal.targetDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex-1 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${
                                  (goal.progress.current /
                                    goal.progress.target) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                          <span className="text-sm">
                            {goal.progress.current}/{goal.progress.target}{" "}
                            {goal.progress.unit}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          className="input input-bordered input-sm w-20"
                          value={goal.progress.current}
                          onChange={(e) =>
                            handleUpdateProgress(goal._id, e.target.value)
                          }
                          min="0"
                          max={goal.progress.target}
                          disabled={isLoading}
                        />

                        <select
                          className="select select-bordered select-sm"
                          value={goal.status}
                          onChange={(e) =>
                            handleUpdateStatus(goal._id, e.target.value)
                          }
                          disabled={isLoading}
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() =>
                            handleAddReminder(goal._id, "Check your progress!")
                          }
                          className="btn btn-ghost btn-sm"
                          title="Add reminder"
                          disabled={isLoading}
                        >
                          <Bell className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => handleDeleteGoal(goal._id)}
                          className="btn btn-ghost btn-sm text-red-500"
                          title="Delete goal"
                          disabled={isLoading}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Reminder Badges */}
                    {goal.reminders && goal.reminders.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {goal.reminders.map((reminder, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded"
                          >
                            <Bell className="w-4 h-4" />
                            {reminder.message}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Goals;