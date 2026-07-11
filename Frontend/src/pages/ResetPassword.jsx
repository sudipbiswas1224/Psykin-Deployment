import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AlertCircle, Loader2, Eye, EyeOff, CheckCircle } from "lucide-react";
import { PsykinLogo } from "./Landing";
import toast from "react-hot-toast";
import axiosInstance from "../api/axios";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post(`/auth/reset-password/${token}`, { password });
      if (response.data.success) {
        setIsSuccess(true);
        toast.success("Password reset successful!");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Reset token is invalid or has expired.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50 p-4 transition-colors">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100 dark:ring-slate-800/80 transition-colors">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4">
            <PsykinLogo size={56} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 text-center">
            Please enter your new password below.
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-center rounded-lg bg-red-50 dark:bg-red-950/20 p-4 text-sm text-red-600 dark:text-red-400">
            <AlertCircle size={18} className="mr-2 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isSuccess ? (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-emerald-50 dark:bg-emerald-950/30 p-4 text-emerald-600 dark:text-emerald-400">
                <CheckCircle size={32} />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Success!</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed text-center">
                Your password has been reset successfully. Redirecting you to the login page...
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                htmlFor="password"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent pl-4 pr-12 py-3 text-slate-800 dark:text-white placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer flex items-center justify-center"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                htmlFor="confirmPassword"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent pl-4 pr-12 py-3 text-slate-800 dark:text-white placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
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
              disabled={isLoading}
              className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-3 font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-70 cursor-pointer animate-none"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
