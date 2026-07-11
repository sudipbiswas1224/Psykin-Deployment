import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Leaf, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { PsykinLogo } from "./Landing";
import toast from "react-hot-toast";
import axiosInstance from "../api/axios";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../store/slices/authSlice";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { status, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Decode JWT ID Token securely on frontend
  const decodeGoogleToken = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Failed to decode JWT token:", e);
      return null;
    }
  };

  const handleGoogleSuccess = async (response) => {
    dispatch(loginStart());
    try {
      const decoded = decodeGoogleToken(response.credential);
      if (!decoded) {
        throw new Error("Unable to decode Google account details.");
      }
      
      const { email, name, sub } = decoded;
      const generatedPassword = `GoogleAuthBypassSecret_${sub}`;
      
      try {
        const loginResponse = await axiosInstance.post("/auth/login", {
          email,
          password: generatedPassword,
        });
        
        if (loginResponse.data.success) {
          toast.success("Logged in successfully via Google!");
          dispatch(
            loginSuccess({
              user: loginResponse.data.user,
              token: loginResponse.data.token,
            }),
          );
          navigate("/dashboard");
          return;
        }
      } catch (loginError) {
        // If account does not exist, auto-register
        const isAuthError = loginError.response?.status === 401 || loginError.response?.status === 400 || loginError.response?.status === 404;
        if (isAuthError) {
          const registerResponse = await axiosInstance.post("/auth/register", {
            email,
            displayName: name || "Google User",
            password: generatedPassword,
          });
          
          if (registerResponse.data.success) {
            toast.success("Registered and logged in via Google!");
            dispatch(
              loginSuccess({
                user: registerResponse.data.user,
                token: registerResponse.data.token,
              }),
            );
            navigate("/dashboard");
            return;
          }
        }
        throw loginError;
      }
    } catch (err) {
      let errorMsg = err.response?.data?.error || err.message || "Google login failed.";
      if (errorMsg === "Email already in use") {
        errorMsg = "This email is already registered with a password. Please sign in manually using your email and password.";
      }
      toast.error(errorMsg);
      dispatch(loginFailure(errorMsg));
    }
  };

  useEffect(() => {
    const initializeGoogleBtn = () => {
      /* global google */
      if (typeof google !== "undefined" && import.meta.env.VITE_GOOGLE_CLIENT_ID) {
        google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleSuccess,
        });
        google.accounts.id.renderButton(
          document.getElementById("google-signin-btn"),
          { theme: "outline", size: "large", width: "100%", shape: "rectangular" }
        );
      }
    };

    if (typeof google !== "undefined") {
      initializeGoogleBtn();
    } else {
      const script = document.querySelector("script[src='https://accounts.google.com/gsi/client']");
      if (script) {
        script.addEventListener("load", initializeGoogleBtn);
        return () => script.removeEventListener("load", initializeGoogleBtn);
      }
    }
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      console.log(formData)
      const response = await axiosInstance.post("/auth/login", formData);
      if (response.data.success) {
        toast.success("Logged in successfully! Welcome back.");
        dispatch(
          loginSuccess({
            user: response.data.user,
            token: response.data.token,
          }),
        );
        navigate("/dashboard");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Invalid credentials or server error.";
      toast.error(errorMsg);
      dispatch(
        loginFailure(errorMsg),
      );
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4">
            <PsykinLogo size={56} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Sign in to continue your journey on Psykin.
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-center rounded-lg bg-red-50 p-4 text-sm text-red-600">
            <AlertCircle size={18} className="mr-2" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              className="mb-2 block text-sm font-medium text-slate-700"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full rounded-lg border border-slate-200 px-4 py-3 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label
                className="text-sm font-medium text-slate-700"
                htmlFor="password"
              >
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full rounded-lg border border-slate-200 pl-4 pr-12 py-3 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
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

          <button
            type="submit"
            disabled={status === "loading"}
            className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-3 font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-70"
          >
            {status === "loading" ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-400">Or continue with</span>
          </div>
        </div>

        <div className="flex justify-center">
          <div id="google-signin-btn" className="w-full"></div>
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-emerald-600 hover:text-emerald-700"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
