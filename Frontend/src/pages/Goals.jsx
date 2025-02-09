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

// Custom Toast Component
const Toast = ({ message, type, onClose }) => (
  <div
    className={`fixed bottom-4 right-4 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg text-white transform transition-transform duration-300 ease-in-out ${
      type === "success"
        ? "bg-green-500"
        : type === "warning"
        ? "bg-yellow-500"
        : type === "error"
        ? "bg-red-500"
        : "bg-blue-500"
    }`}
  >
    <span>{message}</span>
    <button onClick={onClose} className="ml-2">
      <X className="w-4 h-4" />
    </button>
  </div>
);

const Goals = () => {
  const [goals, setGoals] = useState([
    {
      id: 1,
      text: "Complete 100 pushups daily",
      completed: false,
      category: "Strength",
      priority: "High",
      status: "In Progress",
      progress: { current: 50, target: 100, unit: "reps" },
      targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      reminders: [
        { date: new Date(), message: "Time for pushups!", isRead: false },
      ],
    },
  ]);
  const [newGoal, setNewGoal] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Strength");
  const [selectedPriority, setSelectedPriority] = useState("Medium");
  const [targetDate, setTargetDate] = useState("");
  const [progressTarget, setProgressTarget] = useState("");
  const [progressUnit, setProgressUnit] = useState("reps");
  const [toast, setToast] = useState(null);

  const categories = ["Strength", "Cardio", "Nutrition", "Flexibility"];
  const priorities = ["Low", "Medium", "High"];
  const statuses = ["Not Started", "In Progress", "Completed", "Archived"];

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Calculate statistics for charts
  const completedGoals = goals.filter((goal) => goal.completed).length;
  const totalGoals = goals.length;
  const completionRate = (completedGoals / totalGoals) * 100;

  const pieData = [
    { name: "Completed", value: completedGoals },
    { name: "Pending", value: totalGoals - completedGoals },
  ];

  const COLORS = {
    Completed: "#4CAF50",
    Pending: "#ff9800",
    High: "#ef4444",
    Medium: "#f59e0b",
    Low: "#10b981",
  };

  const progressData = goals.map((goal) => ({
    name: goal.text.substring(0, 20) + "...",
    progress: (goal.progress.current / goal.progress.target) * 100,
  }));

  const addGoal = (e) => {
    e.preventDefault();
    if (!newGoal.trim() || !progressTarget) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    setGoals([
      ...goals,
      {
        id: Date.now(),
        text: newGoal,
        completed: false,
        category: selectedCategory,
        priority: selectedPriority,
        status: "Not Started",
        progress: {
          current: 0,
          target: Number(progressTarget),
          unit: progressUnit,
        },
        targetDate: targetDate ? new Date(targetDate) : null,
        reminders: [],
      },
    ]);
    setNewGoal("");
    setProgressTarget("");
    showToast("Goal added successfully!", "success");
  };

  const updateProgress = (id, newProgress) => {
    setGoals(
      goals.map((goal) => {
        if (goal.id === id) {
          const updated = {
            ...goal,
            progress: {
              ...goal.progress,
              current: Math.min(Number(newProgress), goal.progress.target),
            },
          };
          // Auto-complete if target reached
          if (updated.progress.current >= updated.progress.target) {
            updated.completed = true;
            updated.status = "Completed";
            showToast("🎉 Congratulations! Goal completed!", "success");
          }
          return updated;
        }
        return goal;
      })
    );
  };

  const updateStatus = (id, newStatus) => {
    setGoals(
      goals.map((goal) => {
        if (goal.id === id) {
          showToast(`Status updated to ${newStatus}`, "info");
          return { ...goal, status: newStatus };
        }
        return goal;
      })
    );
  };

  const addReminder = (id, message) => {
    setGoals(
      goals.map((goal) => {
        if (goal.id === id) {
          showToast("Reminder set!", "success");
          return {
            ...goal,
            reminders: [
              ...goal.reminders,
              {
                date: new Date(),
                message,
                isRead: false,
              },
            ],
          };
        }
        return goal;
      })
    );
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter((g) => g.id !== id));
    showToast("Goal deleted", "warning");
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Fitness Goals Tracker</h1>
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
            <form onSubmit={addGoal} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Enter your new goal..."
                  className="input input-bordered w-full"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                />
                <select
                  className="select select-bordered w-full"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
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
                  />
                  <input
                    type="text"
                    placeholder="Unit"
                    className="input input-bordered w-full"
                    value={progressUnit}
                    onChange={(e) => setProgressUnit(e.target.value)}
                  />
                </div>

                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary w-full">
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
            {goals.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No goals yet. Add some goals to get started!
              </div>
            ) : (
              <div className="space-y-4">
                {goals.map((goal) => (
                  <div
                    key={goal.id}
                    className={`p-4 rounded-lg border bg-gray-300 ${
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
                          <div className="flex-1  rounded-full h-2">
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
                            updateProgress(goal.id, e.target.value)
                          }
                          min="0"
                          max={goal.progress.target}
                        />

                        <select
                          className="select select-bordered select-sm"
                          value={goal.status}
                          onChange={(e) =>
                            updateStatus(goal.id, e.target.value)
                          }
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() =>
                            addReminder(goal.id, "Check your progress!")
                          }
                          className="btn btn-ghost btn-sm"
                          title="Add reminder"
                        >
                          <Bell className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => deleteGoal(goal.id)}
                          className="btn btn-ghost btn-sm text-red-500"
                          title="Delete goal"
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

        {/* Toast Container */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Goals;
