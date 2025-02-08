import React from "react";
import { Link } from "react-router-dom";
import { 
  Target, 
  Calendar, 
  BarChart2, 
  Users,
  ChevronRight
} from "lucide-react";

const UserPage = () => {
  return (
    <div className="min-h-screen p-6 bg-base-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Workout Goals Section */}
        <div className="group relative overflow-hidden rounded-xl bg-primary text-primary-content hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
          <div className="p-8">
            <Target className="w-12 h-12 mb-4" />
            <h2 className="text-3xl font-bold mb-4">Set Your Goals</h2>
            <p className="text-lg opacity-90 mb-6">
              Define your fitness journey with customizable targets and milestone tracking
            </p>
            <div className="flex items-center space-x-2 text-lg font-semibold">
              <span>Create New Goal</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mb-20 blur-2xl transition-all duration-500 group-hover:scale-150" />
        </div>

        {/* Schedule Section */}
        <div className="group relative overflow-hidden rounded-xl bg-secondary text-secondary-content hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
          <div className="p-8">
            <Calendar className="w-12 h-12 mb-4" />
            <h2 className="text-3xl font-bold mb-4">Workout Schedule</h2>
            <p className="text-lg opacity-90 mb-6">
              Plan your training sessions with our intelligent scheduling system
            </p>
            <div className="flex items-center space-x-2 text-lg font-semibold">
              <span>View Calendar</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mb-20 blur-2xl transition-all duration-500 group-hover:scale-150" />
        </div>

        {/* Progress Tracking Section */}
        <div className="group relative overflow-hidden rounded-xl bg-accent text-accent-content hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
          <div className="p-8">
            <BarChart2 className="w-12 h-12 mb-4" />
            <h2 className="text-3xl font-bold mb-4">Track Progress</h2>
            <p className="text-lg opacity-90 mb-6">
              Monitor your achievements with detailed analytics and progress charts
            </p>
            <div className="flex items-center space-x-2 text-lg font-semibold">
              <span>View Stats</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mb-20 blur-2xl transition-all duration-500 group-hover:scale-150" />
        </div>

        {/* Community Section */}
        <div className="group relative overflow-hidden rounded-xl bg-info text-info-content hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
          <div className="p-8">
            <Users className="w-12 h-12 mb-4" />
            <h2 className="text-3xl font-bold mb-4">Join Community</h2>
            <p className="text-lg opacity-90 mb-6">
              Connect with fellow fitness enthusiasts and share your journey
            </p>
            <div className="flex items-center space-x-2 text-lg font-semibold">
              <span>Explore Community</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mb-20 blur-2xl transition-all duration-500 group-hover:scale-150" />
        </div>
      </div>
    </div>
  );
};

export default UserPage;