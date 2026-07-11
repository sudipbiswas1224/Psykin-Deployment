import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Loader2, Mail, ArrowLeft } from "lucide-react";
import { PsykinLogo } from "./Landing";
import toast from "react-hot-toast";
import axiosInstance from "../api/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await axiosInstance.post("/auth/forgot-password", { email });
      if (response.data.success) {
        setIsSubmitted(true);
        toast.success("Reset link sent (simulated)!");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Something went wrong. Please try again.";
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
            Forgot Password
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 text-center">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-center rounded-lg bg-red-50 dark:bg-red-950/20 p-4 text-sm text-red-600 dark:text-red-400">
            <AlertCircle size={18} className="mr-2 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isSubmitted ? (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-emerald-50 dark:bg-emerald-950/30 p-4 text-emerald-600 dark:text-emerald-400">
                <Mail size={32} />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Check Your Email</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed text-center">
                A password reset link has been sent to your email address. Please check your inbox (and spam folder) to reset your password.
              </p>
            </div>
            <Link
              to="/login"
              className="flex w-full items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent px-4 py-3 text-slate-800 dark:text-white placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-3 font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-70 cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Send Reset Link"
              )}
            </button>

            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors py-2"
            >
              <ArrowLeft size={16} /> Back to Sign In
            </Link>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
