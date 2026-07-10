import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Lock,
  Settings,
  Activity,
  Trash2,
  Check,
  AlertCircle,
  Loader2,
  Calendar,
  MessageSquare,
  Sparkles,
  Globe,
  Sun,
  Moon,
  Tv,
  Eye,
  EyeOff,
} from "lucide-react";
import axiosInstance from "../api/axios";
import { updateProfileSuccess, logout } from "../store/slices/authSlice";

const PRESET_AVATARS = ["🧘", "🌿", "🌸", "☀️", "🌊", "⛰️", "🕊️", "🦉", "🦊", "💫"];

const COMMON_TIMEZONES = [
  "UTC",
  "Asia/Kolkata",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Australia/Sydney",
];

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिन्दी" },
];

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // States
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Tab Forms Data
  const [profileForm, setProfileForm] = useState({
    displayName: "",
    avatar: "🧘",
    timezone: "UTC",
  });

  const [prefForm, setPrefForm] = useState({
    theme: "auto",
    language: "en",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [stats, setStats] = useState({
    totalMessages: 0,
    totalSessions: 0,
    joinDate: null,
  });

  // Account deletion states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationEmail, setDeleteConfirmationEmail] = useState("");
  const [deleteError, setDeleteError] = useState("");

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Setup/Fetch User Profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get("/user/profile");
        if (res.data.success) {
          const u = res.data.data;
          setProfileForm({
            displayName: u.profile.displayName || "",
            avatar: u.profile.avatar || "🧘",
            timezone: u.profile.timezone || "UTC",
          });
          setPrefForm({
            theme: u.preferences.theme || "auto",
            language: u.preferences.language || "en",
          });
          setStats({
            totalMessages: u.stats.totalMessages || 0,
            totalSessions: u.stats.totalSessions || 0,
            joinDate: u.stats.joinDate || null,
          });

        }
      } catch (err) {
        console.error("Failed to load profile:", err);
        setMessage({
          type: "error",
          text: err.response?.data?.error || "Failed to sync profile from server.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Auto-clear messages
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: "", text: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Form Handlers
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await axiosInstance.put("/user/profile", {
        displayName: profileForm.displayName,
        avatar: profileForm.avatar,
        timezone: profileForm.timezone,
      });

      if (res.data.success) {
        dispatch(updateProfileSuccess({ user: res.data.data }));
        setMessage({ type: "success", text: "Profile details updated successfully!" });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.error || "Error updating profile details.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreferencesSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await axiosInstance.put("/user/profile", {
        theme: prefForm.theme,
        language: prefForm.language,
      });

      if (res.data.success) {
        dispatch(updateProfileSuccess({ user: res.data.data }));
        setMessage({ type: "success", text: "Application preferences updated!" });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.error || "Error updating preferences.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setIsSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await axiosInstance.put("/user/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      if (res.data.success) {
        setMessage({ type: "success", text: "Password changed successfully!" });
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.error || "Error changing password. Check current password.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmationEmail !== user?.email) {
      setDeleteError("Email address does not match your account email.");
      return;
    }

    setIsSaving(true);
    setDeleteError("");

    try {
      const res = await axiosInstance.delete("/user/delete-account");
      if (res.data.success) {
        setIsDeleteModalOpen(false);
        dispatch(logout());
        navigate("/register");
      }
    } catch (err) {
      setDeleteError(err.response?.data?.error || "Could not delete account. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile Info", icon: User },
    { id: "preferences", label: "Preferences", icon: Settings },
    { id: "security", label: "Security", icon: Lock },
    { id: "stats", label: "My Journey", icon: Activity },
    { id: "danger", label: "Danger Zone", icon: Trash2 },
  ];

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-emerald-600" />
          <p className="mt-4 text-slate-500 font-medium dark:text-slate-400">Loading your profile settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-4">
          <div className="text-4xl md:text-5xl p-4 bg-emerald-50 dark:bg-slate-700/50 rounded-2xl shadow-xs border border-emerald-100/20">
            {profileForm.avatar}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
              Profile & Settings
            </h1>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">
              Manage your identity, settings, and view platform stats.
            </p>
          </div>
        </div>

        {/* Global Message Alert */}
        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm max-w-sm ${
                message.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30"
                  : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30"
              }`}
            >
              {message.type === "success" ? <Check size={18} /> : <AlertCircle size={18} />}
              <span>{message.text}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation Sidebar Tabs */}
        <div className="md:col-span-1 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 gap-2 pb-4 md:pb-0 md:pr-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMessage({ type: "", text: "" });
                }}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all whitespace-nowrap md:w-full text-left ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 shadow-xs border border-emerald-100/20 dark:bg-emerald-950/20 dark:text-emerald-400"
                    : tab.id === "danger"
                    ? "text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/20"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/40"
                }`}
              >
                <Icon size={18} className={isActive ? "text-emerald-600 dark:text-emerald-400" : ""} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Pane */}
        <div className="md:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-xs"
            >
              {/* Profile Details Tab */}
              {activeTab === "profile" && (
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Personal Information</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Update your avatar, display name and timezone settings.</p>
                  </div>

                  {/* Avatar Picker */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Choose Avatar</label>
                    <div className="flex flex-wrap gap-2.5">
                      {PRESET_AVATARS.map((avatar) => (
                        <button
                          key={avatar}
                          type="button"
                          onClick={() => setProfileForm({ ...profileForm, avatar })}
                          className={`text-2xl p-2.5 rounded-xl border transition-all hover:scale-105 active:scale-95 ${
                            profileForm.avatar === avatar
                              ? "bg-emerald-50 border-emerald-500 scale-105 shadow-xs dark:bg-emerald-950/25 dark:border-emerald-400"
                              : "border-slate-100 bg-slate-50/50 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
                          }`}
                        >
                          {avatar}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Display Name Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Display Name</label>
                    <input
                      type="text"
                      required
                      value={profileForm.displayName}
                      onChange={(e) => setProfileForm({ ...profileForm, displayName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                      placeholder="e.g. Robin Williams"
                    />
                  </div>

                  {/* Timezone Select */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Timezone</label>
                    <div className="relative">
                      <select
                        value={profileForm.timezone}
                        onChange={(e) => setProfileForm({ ...profileForm, timezone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors appearance-none"
                      >
                        {COMMON_TIMEZONES.map((tz) => (
                          <option key={tz} value={tz} className="dark:bg-slate-800">
                            {tz}
                          </option>
                        ))}
                      </select>
                      <Globe className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={18} />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-all disabled:opacity-50"
                  >
                    {isSaving && <Loader2 size={18} className="animate-spin" />}
                    Save Changes
                  </button>
                </form>
              )}

              {/* Preferences Tab */}
              {activeTab === "preferences" && (
                <form onSubmit={handlePreferencesSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Application Settings</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Configure theme rendering and regional language options.</p>
                  </div>

                  {/* Theme Selector */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Theme Mode</label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { id: "light", label: "Light", icon: Sun },
                        { id: "dark", label: "Dark", icon: Moon },
                      ].map((t) => {
                        const Icon = t.icon;
                        const isSelected = prefForm.theme === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setPrefForm({ ...prefForm, theme: t.id })}
                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border gap-2.5 transition-all cursor-pointer ${
                              isSelected
                                ? "bg-emerald-50/50 border-emerald-500 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-400 dark:text-emerald-400 shadow-xs"
                                : "border-slate-100 bg-slate-50/40 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            <Icon size={22} />
                            <span className="text-xs font-semibold">{t.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Language Select */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Language</label>
                    <select
                      value={prefForm.language}
                      onChange={(e) => setPrefForm({ ...prefForm, language: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.code} className="dark:bg-slate-800">
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-all disabled:opacity-50"
                  >
                    {isSaving && <Loader2 size={18} className="animate-spin" />}
                    Update Preferences
                  </button>
                </form>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Change Password</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Regularly update your credentials to keep your mental journal private.</p>
                  </div>

                  {/* Current Password */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        required
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer flex items-center justify-center"
                      >
                        {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        required
                        minLength={8}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                        placeholder="Min 8 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer flex items-center justify-center"
                      >
                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer flex items-center justify-center"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-all disabled:opacity-50"
                  >
                    {isSaving && <Loader2 size={18} className="animate-spin" />}
                    Update Password
                  </button>
                </form>
              )}

              {/* Stats Tab */}
              {activeTab === "stats" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">My Journey Stats</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">A high-level dashboard of your platform interactions and consistency.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Join Date */}
                    <div className="bg-slate-50/50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-100/60 dark:border-slate-700/40 flex items-center gap-4">
                      <div className="p-3 bg-emerald-100/50 dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 rounded-xl">
                        <Calendar size={22} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Member Since</p>
                        <p className="text-base font-bold text-slate-800 dark:text-white mt-0.5">
                          {stats.joinDate ? new Date(stats.joinDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "N/A"}
                        </p>
                      </div>
                    </div>

                    

                    
                  </div>
                </div>
              )}

              {/* Danger Zone Tab */}
              {activeTab === "danger" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2 text-red-600 dark:text-red-500">Danger Zone</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Irreversible actions relating to your user profile and journaling records.</p>
                  </div>

                  <div className="bg-red-50/20 dark:bg-red-950/10 border border-red-500/20 dark:border-red-900/30 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-slate-800 dark:text-white">Delete Account</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Permanently purge your account, all encryption-keyed journals, chat histories, and assessment answers. This action cannot be undone.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteConfirmationEmail("");
                        setDeleteError("");
                        setIsDeleteModalOpen(true);
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-3 rounded-xl transition-colors whitespace-nowrap cursor-pointer shrink-0"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
              onClick={() => setIsDeleteModalOpen(false)}
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 md:p-8 z-10"
            >
              <h3 className="text-xl font-bold text-red-600 dark:text-red-500 flex items-center gap-2.5">
                <Trash2 size={24} />
                Delete Account?
              </h3>

              <div className="mt-4 space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  We will cascade delete your journal history, evaluations, metrics, and profiles completely. Please confirm by typing your email: <strong>{user?.email}</strong> below.
                </p>

                <input
                  type="email"
                  value={deleteConfirmationEmail}
                  onChange={(e) => setDeleteConfirmationEmail(e.target.value)}
                  placeholder="Enter email to confirm"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors"
                />

                {deleteError && (
                  <p className="text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1.5 bg-red-50 dark:bg-red-950/15 p-2 rounded-lg border border-red-200/50 dark:border-red-900/30">
                    <AlertCircle size={14} />
                    {deleteError}
                  </p>
                )}

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isSaving || deleteConfirmationEmail !== user?.email}
                    onClick={handleDeleteAccount}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isSaving && <Loader2 size={16} className="animate-spin inline mr-1.5" />}
                    Permanently Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
