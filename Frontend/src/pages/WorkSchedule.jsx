import React, { useState } from 'react';
import { Calendar, Clock, Dumbbell, Users, RotateCcw, Check, Plus, X, ChevronRight, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../Components/card';

const WorkSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [newSession, setNewSession] = useState({
    type: 'Strength',
    duration: 60,
    preferredTime: '09:00',
    frequency: 'weekly',
    intensity: 'medium',
    equipment: 'minimal',
    days: []
  });
  const [conflicts, setConflicts] = useState([]);
  const [toast, setToast] = useState(null);

  const workoutTypes = ['Strength', 'Cardio', 'HIIT', 'Yoga', 'Recovery'];
  const intensityLevels = ['light', 'medium', 'high'];
  const equipmentNeeds = ['minimal', 'moderate', 'full-gym'];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Custom Toast Component
  const Toast = ({ message, type, onClose }) => (
    <div className={`fixed bottom-4 right-4 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg text-white transform transition-transform duration-300 ease-in-out ${
      type === 'success' ? 'bg-green-500' :
      type === 'warning' ? 'bg-yellow-500' :
      'bg-blue-500'
    }`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2">
        <X className="w-4 h-4" />
      </button>
    </div>
  );

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Check for scheduling conflicts
  const checkConflicts = (newSchedule) => {
    const conflicts = [];
    newSchedule.forEach((session, index) => {
      newSchedule.forEach((otherSession, otherIndex) => {
        if (index !== otherIndex) {
          const sameDay = session.days.some(day => otherSession.days.includes(day));
          const timeOverlap = session.preferredTime === otherSession.preferredTime;
          if (sameDay && timeOverlap) {
            conflicts.push({
              day: session.days.find(day => otherSession.days.includes(day)),
              time: session.preferredTime,
              sessions: [session, otherSession]
            });
          }
        }
      });
    });
    return conflicts;
  };

  // Suggest alternative times based on conflicts
  const suggestAlternativeTime = (conflict) => {
    const times = ['06:00', '07:00', '08:00', '09:00', '16:00', '17:00', '18:00', '19:00'];
    const conflictTime = conflict.time;
    const availableTimes = times.filter(time => time !== conflictTime);
    return availableTimes[Math.floor(Math.random() * availableTimes.length)];
  };

  // Intelligent scheduling suggestions
  const getSchedulingSuggestions = (type, intensity) => {
    const suggestions = [];
    
    if (type === 'Strength') {
      suggestions.push('Allow 48 hours between strength sessions for recovery');
      if (intensity === 'high') {
        suggestions.push('Consider adding a recovery day after each session');
      }
    }
    
    if (type === 'HIIT') {
      suggestions.push('Limit HIIT sessions to 2-3 times per week');
      if (intensity === 'high') {
        suggestions.push('Space HIIT sessions at least 48 hours apart');
      }
    }
    
    return suggestions;
  };

  const addSession = () => {
    if (newSession.days.length === 0) {
      showToast('Please select at least one day', 'warning');
      return;
    }

    const updatedSchedule = [...schedule, { ...newSession, id: Date.now() }];
    const newConflicts = checkConflicts(updatedSchedule);
    
    if (newConflicts.length > 0) {
      setConflicts(newConflicts);
      const alternativeTime = suggestAlternativeTime(newConflicts[0]);
      showToast(`Scheduling conflict detected. Consider ${alternativeTime} instead`, 'warning');
    } else {
      setSchedule(updatedSchedule);
      showToast('Training session added successfully!', 'success');
      setConflicts([]);
    }
  };

  const removeSession = (id) => {
    setSchedule(schedule.filter(session => session.id !== id));
    showToast('Session removed', 'info');
  };

  const toggleDay = (day) => {
    setNewSession(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  return (
    <div className="min-h-screen p-6 ">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Training Schedule Planner</h1>

        {/* Add New Session Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Training Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Workout Type</label>
                  <select
                    className="select select-bordered w-full"
                    value={newSession.type}
                    onChange={(e) => setNewSession(prev => ({ ...prev, type: e.target.value }))}
                  >
                    {workoutTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    value={newSession.duration}
                    onChange={(e) => setNewSession(prev => ({ ...prev, duration: e.target.value }))}
                    min="15"
                    max="180"
                    step="15"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Preferred Time</label>
                  <input
                    type="time"
                    className="input input-bordered w-full"
                    value={newSession.preferredTime}
                    onChange={(e) => setNewSession(prev => ({ ...prev, preferredTime: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Intensity</label>
                  <select
                    className="select select-bordered w-full"
                    value={newSession.intensity}
                    onChange={(e) => setNewSession(prev => ({ ...prev, intensity: e.target.value }))}
                  >
                    {intensityLevels.map(level => (
                      <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Equipment Needed</label>
                  <select
                    className="select select-bordered w-full"
                    value={newSession.equipment}
                    onChange={(e) => setNewSession(prev => ({ ...prev, equipment: e.target.value }))}
                  >
                    {equipmentNeeds.map(need => (
                      <option key={need} value={need}>{need.charAt(0).toUpperCase() + need.slice(1)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Select Days</label>
                  <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map(day => (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          newSession.days.includes(day)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button onClick={addSession} className="btn btn-primary">
                <Plus className="w-4 h-4 mr-2" /> Add Session
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Display */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            {schedule.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No training sessions scheduled yet. Add your first session above!
              </div>
            ) : (
              <div className="space-y-4">
                {daysOfWeek.map(day => (
                  <div key={day} className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">{day}</h3>
                    <div className="space-y-2">
                      {schedule
                        .filter(session => session.days.includes(day))
                        .map(session => (
                          <div
                            key={session.id}
                            className="flex items-center justify-between bg-white p-3 rounded border"
                          >
                            <div className="flex items-center gap-4">
                              <Dumbbell className="w-5 h-5 text-blue-500" />
                              <div>
                                <p className="font-medium">{session.type}</p>
                                <p className="text-sm text-gray-500">
                                  {session.preferredTime} • {session.duration} mins • 
                                  {session.intensity.charAt(0).toUpperCase() + session.intensity.slice(1)} intensity
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => removeSession(session.id)}
                              className="btn btn-ghost btn-sm"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Scheduling Suggestions */}
        {schedule.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Smart Scheduling Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {schedule.map(session => 
                  getSchedulingSuggestions(session.type, session.intensity).map((suggestion, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-600">
                      <ChevronRight className="w-4 h-4 text-blue-500" />
                      <span>{suggestion}</span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Toast Notifications */}
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

export default WorkSchedule;