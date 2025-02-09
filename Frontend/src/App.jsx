import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import AdminPage from "./pages/AdminPage";
import { Toaster } from "react-hot-toast";
import UserPage from "./pages/UserPage";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import Navbar from "./Components/Navbar.jsx";
import Goals from "./pages/Goals.jsx";
import WorkSchedule from "./pages/WorkSchedule.jsx";
import ProgressTracker from "./pages/ProgressTracker.jsx";
import Community from "./pages/Community.jsx";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (authUser) {
      navigate("/user");
    }
  }, [authUser]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <Toaster position="top-center" />
      <div className="min-h-screen"> {/* Ensures theme is applied to full page */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* Protected Routes for Clients */}
          {authUser && (
            <>
              <Route path="/user" element={<UserPage />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/schedule" element={<WorkSchedule />} />
              <Route path="/progress" element={<ProgressTracker />} />
              <Route path="/community" element={<Community />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </>
          )}
          {/* Default Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
