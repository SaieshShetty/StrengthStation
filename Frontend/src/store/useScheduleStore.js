import { create } from 'zustand';
import axios from 'axios';

// Set base URL for API requests
const api = axios.create({
  baseURL: '/api'
});

const useScheduleStore = create((set, get) => ({
  schedule: [],
  newSession: {
    type: 'Strength',
    duration: 60,
    preferredTime: '09:00',
    frequency: 'weekly',
    intensity: 'medium',
    equipment: 'minimal',
    days: []
  },
  conflicts: [],
  toast: { visible: false, message: '', type: 'info' },
  loading: false,
  error: null,

  // Form actions
  updateNewSession: (field, value) => set(state => ({
    newSession: { ...state.newSession, [field]: value }
  })),

  toggleDay: (day) => set(state => ({
    newSession: {
      ...state.newSession,
      days: state.newSession.days.includes(day)
        ? state.newSession.days.filter(d => d !== day)
        : [...state.newSession.days, day]
    }
  })),

  resetNewSession: () => set({
    newSession: {
      type: 'Strength',
      duration: 60,
      preferredTime: '09:00',
      frequency: 'weekly',
      intensity: 'medium',
      equipment: 'minimal',
      days: []
    }
  }),

  // Toast notifications
  showToast: (message, type = 'info') => {
    set({ toast: { visible: true, message, type } });
    
    // Clear toast after 3 seconds
    setTimeout(() => {
      set(state => {
        // Only clear if it's the same toast (prevents clearing a newly shown toast)
        if (state.toast && state.toast.message === message) {
          return { toast: { ...state.toast, visible: false } };
        }
        return state;
      });
    }, 3000);
  },

  closeToast: () => set(state => ({ 
    toast: { ...state.toast, visible: false } 
  })),

  // Conflict checking logic
  checkConflicts: (newSchedule) => {
    const conflicts = [];
    if (!Array.isArray(newSchedule)) return conflicts;
    
    newSchedule.forEach((session, index) => {
      newSchedule.forEach((otherSession, otherIndex) => {
        if (index !== otherIndex) {
          const sessionDays = Array.isArray(session.days) ? session.days : [];
          const otherSessionDays = Array.isArray(otherSession.days) ? otherSession.days : [];
  
          const commonDays = sessionDays.filter(day => otherSessionDays.includes(day));
          
          if (commonDays.length > 0 && session.preferredTime === otherSession.preferredTime) {
            commonDays.forEach(day => {
              conflicts.push({
                day,
                time: session.preferredTime,
                sessions: [session, otherSession]
              });
            });
          }
        }
      });
    });
    
    return conflicts;
  },

  suggestAlternativeTime: (conflict) => {
    const times = ['06:00', '07:00', '08:00', '09:00', '16:00', '17:00', '18:00', '19:00'];
    const conflictTime = conflict.time;
    const availableTimes = times.filter(time => time !== conflictTime);
    return availableTimes[Math.floor(Math.random() * availableTimes.length)];
  },

  getSchedulingSuggestions: (type, intensity) => {
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
  },

  // API interactions - modified to handle errors better
  fetchSchedule: async (userId) => {
    set({ loading: true, error: null });
    try {
      // For development testing without backend
      if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_MOCK_API === 'true') {
        // Simulated response
        const mockData = [
          {
            _id: '1',
            type: 'Strength',
            duration: 60,
            preferredTime: '09:00',
            intensity: 'medium',
            equipment: 'minimal',
            days: ['Monday', 'Wednesday', 'Friday'],
            completed: []
          },
          {
            _id: '2',
            type: 'Cardio',
            duration: 45,
            preferredTime: '18:00',
            intensity: 'high',
            equipment: 'minimal',
            days: ['Tuesday', 'Thursday'],
            completed: [{ date: new Date() }]
          }
        ];
        
        setTimeout(() => {
          set({ schedule: mockData, loading: false });
        }, 500);
        return;
      }
      
      const response = await api.get(`/schedule/fetchschedule/${userId}`);
      set({ schedule: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching schedule:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to fetch schedule', 
        loading: false,
        schedule: [] // Ensure schedule is an empty array on failure
      });
      get().showToast('Failed to load schedule. Using offline mode.', 'warning');
      
      // Fallback to empty schedule
      set({ schedule: [] });
    }
  },

  addSession: async () => {
    const { newSession, schedule, checkConflicts, suggestAlternativeTime, showToast, resetNewSession } = get();
    
    if (newSession.days.length === 0) {
      showToast('Please select at least one day', 'warning');
      return;
    }

    const sessionToAdd = { ...newSession, id: Date.now().toString() };
    const updatedSchedule = [...(Array.isArray(schedule) ? schedule : []), sessionToAdd];
    const newConflicts = checkConflicts(updatedSchedule);
    
    if (newConflicts.length > 0) {
      set({ conflicts: newConflicts });
      const alternativeTime = suggestAlternativeTime(newConflicts[0]);
      showToast(`Scheduling conflict detected. Consider ${alternativeTime} instead`, 'warning');
      return;
    }
    
    set({ loading: true, error: null });
    try {
      // For development testing without backend
      if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_MOCK_API === 'true') {
        setTimeout(() => {
          set(state => ({ 
            schedule: [...(Array.isArray(state.schedule) ? state.schedule : []), sessionToAdd],
            loading: false,
            conflicts: []
          }));
          showToast('Training session added successfully!', 'success');
          resetNewSession();
        }, 500);
        return;
      }
      
      const response = await api.post('/schedule/addschedule', sessionToAdd);
      set(state => ({ 
        schedule: [...(Array.isArray(state.schedule) ? state.schedule : []), response.data],
        loading: false,
        conflicts: []
      }));
      showToast('Training session added successfully!', 'success');
      resetNewSession();
    } catch (error) {
      console.error('Error adding session:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to add session', 
        loading: false 
      });
      showToast('Failed to add session', 'warning');
    }
  },

  removeSession: async (id) => {
    set({ loading: true, error: null });
    try {
      // For development testing without backend
      if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_MOCK_API === 'true') {
        setTimeout(() => {
          set(state => ({ 
            schedule: Array.isArray(state.schedule) 
              ? state.schedule.filter(session => (session._id || session.id) !== id)
              : [],
            loading: false 
          }));
          get().showToast('Session removed', 'info');
        }, 500);
        return;
      }
      
      await api.delete(`/schedule/removeschedule/${id}`);
      set(state => ({ 
        schedule: Array.isArray(state.schedule) 
          ? state.schedule.filter(session => (session._id || session.id) !== id)
          : [],
        loading: false 
      }));
      get().showToast('Session removed', 'info');
    } catch (error) {
      console.error('Error removing session:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to remove session', 
        loading: false 
      });
      get().showToast('Failed to remove session', 'warning');
    }
  },

  updateSession: async (id, updatedData) => {
    set({ loading: true, error: null });
    try {
      // For development testing without backend
      if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_MOCK_API === 'true') {
        setTimeout(() => {
          set(state => ({
            schedule: Array.isArray(state.schedule) 
              ? state.schedule.map(session => 
                  (session._id || session.id) === id ? { ...session, ...updatedData } : session
                )
              : [],
            loading: false
          }));
          get().showToast('Session updated successfully', 'success');
        }, 500);
        return;
      }
      
      const response = await api.put(`/schedule/updateschedule/${id}`, updatedData);
      set(state => ({
        schedule: Array.isArray(state.schedule) 
          ? state.schedule.map(session => 
              (session._id || session.id) === id ? response.data : session
            )
          : [],
        loading: false
      }));
      get().showToast('Session updated successfully', 'success');
    } catch (error) {
      console.error('Error updating session:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to update session', 
        loading: false 
      });
      get().showToast('Failed to update session', 'warning');
    }
  },

  fetchWorkoutStats: async () => {
    set({ loading: true, error: null });
    try {
      // For development testing without backend
      if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_MOCK_API === 'true') {
        const mockStats = {
          workoutsByType: [
            { _id: 'Strength', count: 3 },
            { _id: 'Cardio', count: 2 },
            { _id: 'HIIT', count: 1 }
          ],
          totalCompletedSessions: 8,
          completionRates: [
            { type: 'Strength', completionRate: 80 },
            { type: 'Cardio', completionRate: 75 },
            { type: 'HIIT', completionRate: 66 }
          ]
        };
        
        setTimeout(() => {
          set({ workoutStats: mockStats, loading: false });
        }, 500);
        
        return mockStats;
      }
      
      const response = await api.get('/schedule/stats/summary');
      
      set({ 
        workoutStats: response.data,
        loading: false 
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching workout statistics:', error);
      set({ 
        error: error.response?.data?.message || 'Failed to fetch workout statistics', 
        loading: false 
      });
      get().showToast('Failed to load workout statistics', 'warning');
      return null;
    }
  }
}));

export default useScheduleStore;