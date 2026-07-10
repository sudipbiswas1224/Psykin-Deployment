import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PsykinLogo } from "../../pages/Landing";
import { logout } from "../../store/slices/authSlice";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  BookHeart,
  BrainCircuit,
  MessageCircleHeart,
  Stethoscope,
  UserCircle,
  LogOut,
  Menu,
  X,
  ShieldAlert,
  ClipboardCheck,
  BotMessageSquare,
  Sprout,
} from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Mind Garden", path: "/journal", icon: Sprout },
    { name: "Assessments", path: "/assessments", icon: ClipboardCheck },
    { name: "AI Companion", path: "/chatbot", icon: BotMessageSquare },
    { name: "Doctors", path: "/doctors", icon: Stethoscope },
    { name: "Profile", path: "/profile", icon: UserCircle },
    { name: "Emergency SOS", path: "/sos", icon: ShieldAlert, isAlert: true },
  ];

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully. Have a peaceful day!");
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="fixed top-4 left-4 z-50 rounded-lg bg-white p-2 text-slate-700 shadow-sm ring-1 ring-slate-200 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 transition-transform duration-300 md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Brand */}
        <div className="flex h-20 items-center justify-center border-b border-slate-100 dark:border-slate-800 px-6">
          <Link to="/" className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <PsykinLogo size={36} />
            Psykin
          </Link>
        </div>

        {/* User Info (Mobile mostly or sidebar top) */}
        <div className="px-6 py-6 border-b border-slate-50 dark:border-slate-800/60 flex items-center gap-3">
          <div className="text-2xl p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl shrink-0">
            {user?.profile?.avatar || "🧘"}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Welcome,</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5">
              {user?.profile?.displayName || user?.displayName || user?.name || "User"}
            </p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);

            if (item.isAlert) {
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition-all border border-red-500/20 shadow-xs mt-4 ${
                    isActive
                      ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400"
                      : "bg-red-50/50 text-red-600 hover:bg-red-70 hover:text-red-700 dark:text-red-500 dark:hover:bg-red-950/10 dark:bg-slate-700/40"
                  }`}
                >
                  <Icon
                    size={20}
                    className="mr-3 text-red-500 animate-pulse shrink-0"
                  />
                  {item.name}
                </Link>
              );
            }

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/40 dark:hover:text-slate-200"
                }`}
              >
                <Icon
                  size={20}
                  className={`mr-3 ${isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"}`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-slate-100 dark:border-slate-800 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            <LogOut size={20} className="mr-3 text-red-500" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
