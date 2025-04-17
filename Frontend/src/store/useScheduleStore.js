import { create } from 'zustand';
import axios from 'axios';

// Set base URL for API requests - Fixed to ensure proper URL construction
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
});

// Helper function to remove circular references - No changes needed, works well
const sanitizeObject = (obj) => {
  // Handle primitives, null, and undefined
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }
  
  // Special handling for DOM nodes and React elements
  if (
    // Check for DOM node properties
    obj.nodeType !== undefined || 
    // Check for React element's $$typeof property
    (obj.$$typeof !== undefined) ||
    // Check if has common DOM element properties
    obj.addEventListener || 
    obj.querySelector || 
    obj.parentNode
  ) {
    return null; // Skip DOM nodes and React elements entirely
  }
  
  // Handle Date objects
  if (obj instanceof Date) {
    return obj.toISOString();
  }
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  // For regular objects, create a clean copy
  const sanitized = {};
  
  for (const key in obj) {
    // Skip if not own property or starts with underscore or 'on' (React event handlers)
    if (!Object.prototype.hasOwnProperty.call(obj, key) || 
        key.startsWith('_') || 
        key.startsWith('on') || 
        key === 'ref') {
      continue;
    }
    
    const value = obj[key];
    
    // Skip functions, symbols, and other non-serializable types
    if (typeof value === 'function' || 
        typeof value === 'symbol' || 
        value === undefined) {
      continue;
    }
    
    try {
      // Try stringifying as a test (will catch circular refs)
      JSON.stringify(value);
      // If it succeeded, store the sanitized value
      sanitized[key] = sanitizeObject(value);
    } catch (e) {
      // Skip this property if it can't be serialized
      continue;
    }
  }
  
  return sanitized;
};

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
                sessions: [
                  sanitizeObject(session),
                  sanitizeObject(otherSession)
                ]
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

  // FIXED API interactions
  fetchSchedule: async (userId) => {
    set({ loading: true, error: null });
    try {
      // IMPROVED mock data handling
      if (import.meta.env.DEV && import.meta.env.VITE_MOCK_API === 'true') {
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
            completed: [{ date: new Date().toISOString() }]
          }
        ];
        
        setTimeout(() => {
          set({ schedule: mockData, loading: false });
        }, 500);
        return;
      }
      
      // FIXED: Use the correct endpoint structure to match the backend
      console.log("Fetching schedule from:", `/schedule/fetchschedule/${userId}`);
      
      const response = await api.get(`/schedule/fetchschedule/${userId}`);
      set({ schedule: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching schedule:', error);
      // IMPROVED error handling with more details
      const errorMessage = error.response?.data?.message || 'Failed to fetch schedule';
      const statusCode = error.response?.status;
      
      console.log(`API Error (${statusCode}): ${errorMessage}`);
      
      set({ 
        error: errorMessage, 
        loading: false,
        schedule: [] // Ensure schedule is an empty array on failure
      });
      
      // Show more informative toast
      get().showToast(`Failed to load schedule (${statusCode}). Using offline mode.`, 'warning');
      
      // Fallback to empty schedule
      set({ schedule: [] });
    }
  },

  addSession: async (userId) => {
    const { newSession, schedule, checkConflicts, suggestAlternativeTime, showToast, resetNewSession } = get();
    
    if (newSession.days.length === 0) {
      showToast('Please select at least one day', 'warning');
      return;
    }
  
    try {
      // FIXED: Ensure proper userId handling
      const sessionData = {
        type: String(newSession.type || 'Strength'),
        duration: Number(newSession.duration || 60),
        preferredTime: String(newSession.preferredTime || '09:00'),
        frequency: String(newSession.frequency || 'weekly'),
        intensity: String(newSession.intensity || 'medium'),
        equipment: String(newSession.equipment || 'minimal'),
        days: Array.isArray(newSession.days) ? [...newSession.days].map(day => String(day)) : [],
        // FIXED: Don't pass userId as object
        user: userId,
        id: String(Date.now())
      };
      
      // For conflict checking, create clean primitive versions of existing schedule
      const primitiveSchedule = Array.isArray(schedule) ? 
        schedule.map(item => ({
          id: String(item.id || item._id || ''),
          type: String(item.type || ''),
          duration: Number(item.duration || 0),
          preferredTime: String(item.preferredTime || ''),
          days: Array.isArray(item.days) ? [...item.days].map(day => String(day)) : []
        })) : [];
      
      const updatedSchedule = [...primitiveSchedule, sessionData];
      const newConflicts = checkConflicts(updatedSchedule);
      
      if (newConflicts.length > 0) {
        set({ conflicts: newConflicts });
        const alternativeTime = suggestAlternativeTime(newConflicts[0]);
        showToast(`Scheduling conflict detected. Consider ${alternativeTime} instead`, 'warning');
        return;
      }
      
      set({ loading: true, error: null });
      
      // IMPROVED: Better mock data handling
      const useMockData = import.meta.env.DEV && (import.meta.env.VITE_MOCK_API === 'true');
      
      if (useMockData) {
        setTimeout(() => {
          // Add ID to simulate backend response
          const mockResponseData = {
            ...sessionData,
            _id: String(Date.now())
          };
          
          set(state => ({ 
            schedule: [...(Array.isArray(state.schedule) ? state.schedule : []), mockResponseData],
            loading: false,
            conflicts: []
          }));
          showToast('Training session added successfully! (Mock)', 'success');
          resetNewSession();
        }, 500);
        return;
      }
      
      try {
        // FIXED: Log clear data for debugging
        console.log("Sending session data to API:", JSON.stringify(sessionData));
        const response = await api.post('/schedule/addschedule', sessionData);
        
        set(state => ({ 
          schedule: [...(Array.isArray(state.schedule) ? state.schedule : []), response.data],
          loading: false,
          conflicts: []
        }));
        
        showToast('Training session added successfully!', 'success');
        resetNewSession();
      } catch (apiError) {
        console.error('API Error:', apiError);
        // IMPROVED: Better error details
        console.log("Error response data:", apiError.response?.data);
        console.log("Error response status:", apiError.response?.status);
        
        // If API call fails, fall back to mock data in development
        if (import.meta.env.DEV) {
          console.log("Falling back to local data storage");
          
          // Add mock ID
          const localSessionData = {
            ...sessionData,
            _id: String(Date.now())
          };
          
          set(state => ({ 
            schedule: [...(Array.isArray(state.schedule) ? state.schedule : []), localSessionData],
            loading: false,
            conflicts: []
          }));
          
          showToast('API unavailable. Session saved locally.', 'info');
          resetNewSession();
        } else {
          // In production, show the error
          set({ 
            error: apiError.response?.data?.message || 'API endpoint not found', 
            loading: false 
          });
          showToast('Failed to save session to server', 'error');
        }
      }
    } catch (error) {
      console.error('Error adding session:', error);
      
      // More detailed error logging
      if (error.response) {
        console.log("Error response data:", error.response.data);
        console.log("Error response status:", error.response.status);
      } else if (error.message) {
        console.log("Error message:", error.message);
      }
      
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
      if (import.meta.env.DEV && import.meta.env.VITE_MOCK_API === 'true') {
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
      // IMPROVED error reporting
      const statusCode = error.response?.status;
      const errorMessage = error.response?.data?.message || 'Failed to remove session';
      
      set({ 
        error: errorMessage, 
        loading: false 
      });
      get().showToast(`Failed to remove session (${statusCode})`, 'warning');
      
      // Fall back to local removal in development
      if (import.meta.env.DEV) {
        set(state => ({
          schedule: Array.isArray(state.schedule)
            ? state.schedule.filter(session => (session._id || session.id) !== id)
            : [],
          loading: false
        }));
        get().showToast('Removed session locally', 'info');
      }
    }
  },

  updateSession: async (id, updatedData) => {
    set({ loading: true, error: null });
    try {
      // Sanitize data to prevent circular references
      const cleanData = sanitizeObject(updatedData);
      
      // For development testing without backend
      if (import.meta.env.DEV && import.meta.env.VITE_MOCK_API === 'true') {
        setTimeout(() => {
          set(state => ({
            schedule: Array.isArray(state.schedule) 
              ? state.schedule.map(session => 
                  (session._id || session.id) === id ? { ...session, ...cleanData } : session
                )
              : [],
            loading: false
          }));
          get().showToast('Session updated successfully (Mock)', 'success');
        }, 500);
        return;
      }
      
      const response = await api.put(`/schedule/updateschedule/${id}`, cleanData);
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
      // IMPROVED error reporting
      const statusCode = error.response?.status;
      const errorMessage = error.response?.data?.message || 'Failed to update session';
      
      set({ 
        error: errorMessage,
        loading: false 
      });
      get().showToast(`Failed to update session (${statusCode})`, 'warning');
      
      // Fall back to local update in development
      if (import.meta.env.DEV) {
        set(state => ({
          schedule: Array.isArray(state.schedule)
            ? state.schedule.map(session =>
                (session._id || session.id) === id ? { ...session, ...cleanData } : session
              )
            : [],
          loading: false
        }));
        get().showToast('Updated session locally', 'info');
      }
    }
  },

  fetchWorkoutStats: async () => {
    set({ loading: true, error: null });
    try {
      // For development testing without backend
      if (import.meta.env.DEV && import.meta.env.VITE_MOCK_API === 'true') {
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
      const statusCode = error.response?.status;
      const errorMessage = error.response?.data?.message || 'Failed to fetch workout statistics';
      
      set({ 
        error: errorMessage,
        loading: false 
      });
      get().showToast(`Failed to load workout statistics (${statusCode})`, 'warning');
      
      // Return mock data in development as fallback
      if (import.meta.env.DEV) {
        const fallbackStats = {
          workoutsByType: [
            { _id: 'Strength', count: 2 },
            { _id: 'Cardio', count: 1 }
          ],
          totalCompletedSessions: 3,
          completionRates: [
            { type: 'Strength', completionRate: 50 },
            { type: 'Cardio', completionRate: 60 }
          ]
        };
        
        set({ workoutStats: fallbackStats, loading: false });
        return fallbackStats;
      }
      
      return null;
    }
  }
}));

export default useScheduleStore;