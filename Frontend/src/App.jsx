import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import axiosInstance from "./api/axios";
import { updateProfileSuccess } from "./store/slices/authSlice";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import AssessmentsList from "./pages/AssessmentsList";
import AssessmentWizard from "./pages/AssessmentWizard";
import Journals from "./pages/Journals";
import JournalEditor from "./pages/JournalEditor";
import Chatbot from "./pages/Chatbot";
import Recommendations from "./pages/Recommendations";
import DoctorDirectory from "./pages/DoctorDirectory";
import SosDirectory from "./pages/SosDirectory";
import SOSModal from "./components/SOSModal";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const theme = user?.preferences?.theme === "light" ? "light" : "dark";

  // Sync/Fetch profile on application mount (if authenticated)
  useEffect(() => {
    if (!isAuthenticated) return;

    const syncProfile = async () => {
      try {
        const res = await axiosInstance.get("/user/profile");
        if (res.data.success) {
          dispatch(updateProfileSuccess({ user: res.data.data }));
        }
      } catch (err) {
        console.error("Failed to sync profile on app load:", err);
      }
    };

    syncProfile();
  }, [isAuthenticated, dispatch]);

  // Global Theme listener and application
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        {/* Global SOS Modal trigger */}
        <SOSModal />

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Phase 5: Journaling */}
            <Route path="/journal" element={<Journals />} />
            <Route path="/journal/new" element={<JournalEditor />} />

            {/* Phase 4: Assessments */}
            <Route path="/assessments" element={<AssessmentsList />} />
            <Route path="/assessments/:type" element={<AssessmentWizard />} />

            {/* Phase 5: Chatbot */}
            <Route path="/chatbot" element={<Chatbot />} />

            {/* Phase 6: Recommendations & Polish */}
            <Route path="/recommendations" element={<Recommendations />} />

            <Route path="/doctors" element={<DoctorDirectory />} />

            {/* SOS / Crisis Directory Route */}
            <Route path="/sos" element={<SosDirectory />} />

            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="/" element={<Landing />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
