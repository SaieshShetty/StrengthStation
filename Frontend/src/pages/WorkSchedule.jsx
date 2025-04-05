import React, { useEffect } from "react";
import {
  Calendar,
  Clock,
  Dumbbell,
  Users,
  RotateCcw,
  Check,
  Plus,
  X,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../Components/card";
import useScheduleStore from "../store/useScheduleStore.js";

const WorkSchedule = () => {
  const {
    schedule,
    newSession,
    conflicts,
    toast,
    loading,
    error,
    updateNewSession,
    toggleDay,
    resetNewSession,
    showToast,
    closeToast,
    addSession,
    removeSession,
    fetchSchedule,
    getSchedulingSuggestions,
  } = useScheduleStore();

  useEffect(() => {
    // Fetch schedule data on component mount
    // In a real app, you'd get the userId from auth context
    fetchSchedule("currentUserId");
  }, [fetchSchedule]);

  const workoutTypes = ["Strength", "Cardio", "HIIT", "Yoga", "Recovery"];
  const intensityLevels = ["light", "medium", "high"];
  const equipmentNeeds = ["minimal", "moderate", "full-gym"];
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Custom Toast Component
  const Toast = ({ message, type, onClose }) => (
    <div
      className={`fixed bottom-4 right-4 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg text-white transform transition-transform duration-300 ease-in-out ${
        type === "success"
          ? "bg-green-500"
          : type === "warning"
          ? "bg-yellow-500"
          : "bg-blue-500"
      }`}
    >
      <span>{message}</span>
      <button onClick={onClose} className="ml-2">
        <X className="w-4 h-4" />
      </button>
    </div>
  );

  // Handler for form input changes
  const handleInputChange = (field, e) => {
    updateNewSession(field, e.target.value);
  };

  // Get all unique suggestions
  const getAllSuggestions = () => {
    const allSuggestions = [];
    if (Array.isArray(schedule)) {
      schedule.forEach((session) => {
        if (session && session.type && session.intensity) {
          const sessionSuggestions = getSchedulingSuggestions(
            session.type,
            session.intensity
          );
          if (Array.isArray(sessionSuggestions)) {
            sessionSuggestions.forEach((suggestion) => {
              if (!allSuggestions.includes(suggestion)) {
                allSuggestions.push(suggestion);
              }
            });
          }
        }
      });
    }
    return allSuggestions;
  };

  // Ensure schedule is always an array
  const safeSchedule = Array.isArray(schedule) ? schedule : [];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Training Schedule Planner</h1>

        {/* Loading and Error States */}
        {loading && (
          <div className="flex justify-center my-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        {/* Add New Session Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Training Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Workout Type
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={newSession.type}
                    onChange={(e) => handleInputChange("type", e)}
                    disabled={loading}
                  >
                    {workoutTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    value={newSession.duration}
                    onChange={(e) => handleInputChange("duration", e)}
                    min="15"
                    max="180"
                    step="15"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Preferred Time
                  </label>
                  <input
                    type="time"
                    className="input input-bordered w-full"
                    value={newSession.preferredTime}
                    onChange={(e) => handleInputChange("preferredTime", e)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Intensity
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={newSession.intensity}
                    onChange={(e) => handleInputChange("intensity", e)}
                    disabled={loading}
                  >
                    {intensityLevels.map((level) => (
                      <option key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Equipment Needed
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={newSession.equipment}
                    onChange={(e) => handleInputChange("equipment", e)}
                    disabled={loading}
                  >
                    {equipmentNeeds.map((need) => (
                      <option key={need} value={need}>
                        {need.charAt(0).toUpperCase() + need.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Select Days
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        disabled={loading}
                        className={`px-3 py-1 rounded-full text-sm ${
                          newSession.days.includes(day)
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700"
                        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={addSession}
                disabled={loading}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Session
              </button>
              <button
                type="button"
                onClick={resetNewSession}
                disabled={loading}
                className="btn btn-outline"
              >
                <RotateCcw className="w-4 h-4 mr-2" /> Reset
              </button>
            </div>

            {/* Conflict Warnings */}
            {Array.isArray(conflicts) && conflicts.length > 0 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <h4 className="font-medium text-yellow-800 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Scheduling Conflicts Detected
                </h4>
                <ul className="mt-2 space-y-1 text-sm text-yellow-700">
                  {conflicts.map((conflict, index) => (
                    <li key={index}>
                      {`${conflict.day} at ${conflict.time} - Conflicts with ${
                        conflict.sessions && 
                        Array.isArray(conflict.sessions) && 
                        conflict.sessions[1] && 
                        conflict.sessions[1].type
                          ? conflict.sessions[1].type
                          : "another"
                      } session`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Schedule Display */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            {safeSchedule.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {loading
                  ? "Loading schedule..."
                  : "No training sessions scheduled yet. Add your first session above!"}
              </div>
            ) : (
              <div className="space-y-4">
                {daysOfWeek.map((day) => (
                  <div key={day} className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">{day}</h3>
                    <div className="space-y-2">
                      {safeSchedule
                        .filter(
                          (session) =>
                            session &&
                            Array.isArray(session.days) &&
                            session.days.includes(day)
                        )
                        .sort((a, b) =>
                          a.preferredTime && b.preferredTime
                            ? a.preferredTime.localeCompare(b.preferredTime)
                            : 0
                        )
                        .map((session) => (
                          <div
                            key={session._id || session.id}
                            className="flex items-center justify-between bg-white p-3 rounded border"
                          >
                            <div className="flex items-center gap-4">
                              <Dumbbell className="w-5 h-5 text-blue-500" />
                              <div>
                                <p className="font-medium">{session.type}</p>
                                <p className="text-sm text-gray-500">
                                  {session.preferredTime} • {session.duration}{" "}
                                  mins •
                                  {session.intensity &&
                                    session.intensity.charAt(0).toUpperCase() +
                                      session.intensity.slice(1)}{" "}
                                  intensity
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {session.completed &&
                                Array.isArray(session.completed) &&
                                session.completed.length > 0 && (
                                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                                    <Check className="w-3 h-3 mr-1" />
                                    {session.completed.length}
                                  </span>
                                )}
                              <button
                                type="button"
                                onClick={() =>
                                  removeSession(session._id || session.id)
                                }
                                disabled={loading}
                                className="btn btn-ghost btn-sm"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Training Tips */}
        {safeSchedule.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Training Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {getAllSuggestions().map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <ChevronRight className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Render Toast if visible */}
      {toast && toast.visible && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}
    </div>
  );
};

export default WorkSchedule;