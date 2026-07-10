import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axios";
import {
  Activity,
  BookHeart,
  ClipboardCheck,
  LineChart as LineIcon,
  ArrowRight,
  BotMessageSquare,
  Sprout,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const formatShortDate = (value) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

const formatFullDate = (value) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [analytics, setAnalytics] = useState({});
  const [activeTab, setActiveTab] = useState("");
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!user?.id) return;
        const res = await axiosInstance.get(`/assessment/analytics/${user.id}`);

        const groupedAnalytics = res.data || {};
        console.log('Analytics data received', groupedAnalytics)
        const normalizedAnalytics = Object.entries(groupedAnalytics).reduce(
          (acc, [testType, points]) => {
            acc[testType] = Array.isArray(points)
              ? points
                  .map((point, index) => {
                    const timestamp = new Date(point.date).getTime();
                    return {
                      id: `${testType}-${index}`,
                      timestamp,
                      score: point.totalScore || 0,
                    };
                  })
                  .filter((point) => Number.isFinite(point.timestamp))
              : [];
            return acc;
          },
          {},
        );
        setLoading(false);
        setAnalytics(normalizedAnalytics);

        const firstTab = Object.keys(normalizedAnalytics)[0] || "";
        setActiveTab((currentTab) => currentTab || firstTab);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        // data loaded
      }
    };

    fetchDashboardData();
  }, [user]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
  };

  const testTabs = Object.keys(analytics);
  const activeChartData = activeTab ? analytics[activeTab] || [] : [];

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-20">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 p-8 text-white shadow-sm overflow-hidden relative">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white opacity-10"></div>
        <div className="absolute bottom-0 right-16 -mb-8 h-24 w-24 rounded-full bg-white opacity-10"></div>

        <h1 className="relative z-10 text-3xl font-bold tracking-tight md:text-4xl">
          {getGreeting()},{" "}
          {user?.displayName?.split(" ")[0] ||
            user?.name?.split(" ")[0] ||
            "Friend"}
          !
        </h1>
        <p className="relative z-10 mt-2 text-emerald-50 max-w-lg">
          Take a deep breath. Today is a new day full of possibilities. How are
          you feeling right now?
        </p>
      </div>

      {/* Quick Action Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Action 1 */}
        <Link
          to="/journal/new"
          className="group flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 hover:shadow-md hover:ring-slate-200 transition-all"
        >
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 group-hover:scale-105 transition-transform">
            <Sprout size={24} />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">
            Tend Your Mind Garden
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Pour out your daily thoughts, feelings, and experiences securely.
          </p>
          <div className="mt-4 flex items-center text-sm font-medium text-orange-600 group-hover:text-orange-700">
            Plant a thought <ArrowRight size={16} className="ml-1" />
          </div>
        </Link>

        {/* Action 2 */}
        <Link
          to="/assessments"
          className="group flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 hover:shadow-md hover:ring-slate-200 transition-all"
        >
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform">
            <ClipboardCheck size={24} />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">
            Take an Assessment
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Check your current stress or mood.
          </p>
          <div className="mt-4 flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
            View tests <ArrowRight size={16} className="ml-1" />
          </div>
        </Link>

        {/* Action 3 */}
        <Link
          to="/chatbot"
          className="group flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 hover:shadow-md hover:ring-slate-200 transition-all sm:col-span-2 lg:col-span-1"
        >
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 group-hover:scale-105 transition-transform">
            <BotMessageSquare size={24} />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">
            Chat with AI Companion
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Get empathetic, immediate guidance.
          </p>
          <div className="mt-4 flex items-center text-sm font-medium text-purple-600 group-hover:text-purple-700">
            Start chat <ArrowRight size={16} className="ml-1" />
          </div>
        </Link>
      </div>

      {/* Analytics Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart View */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Assessment Analytics
              </h2>
              <p className="text-sm text-slate-500">
                Scores and dates grouped by test type
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-2 text-slate-500">
              <LineIcon size={20} />
            </div>
          </div>

          <div className="mb-5 flex flex-wrap gap-2">
            {testTabs.length > 0 ? (
              testTabs.map((testType) => {
                const isActive = testType === activeTab;
                return (
                  <button
                    key={testType}
                    type="button"
                    onClick={() => setActiveTab(testType)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                    }`}
                  >
                    {testType}
                  </button>
                );
              })
            ) : (
              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-500">
                No assessment data yet
              </span>
            )}
          </div>

          <div className="h-64 w-full">
            {loading ? (
              <div className="flex h-full items-center justify-center rounded-2xl bg-slate-50 text-sm text-slate-500">
                Loading analytics...
              </div>
            ) : activeChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={activeChartData}
                  margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E2E8F0"
                  />
                  <XAxis
                    type="number"
                    dataKey="timestamp"
                    axisLine={false}
                    tickLine={false}
                    domain={["dataMin", "dataMax"]}
                    tick={{ fill: "#94A3B8", fontSize: 12 }}
                    tickFormatter={formatShortDate}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#98a7bcff", fontSize: 12 }}
                  />
                  <Tooltip
                    labelFormatter={formatFullDate}
                    formatter={(value) => [value, "Score"]}
                    contentStyle={{
                      backgroundColor: isDark ? "#1e293b" : "#ffffff",
                      borderRadius: "12px",
                      border: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                    }}
                    labelStyle={{
                      color: isDark ? "#f1f5f9" : "#1e293b",
                      fontWeight: "bold",
                      marginBottom: "4px",
                    }}
                    itemStyle={{
                      color: isDark ? "#cbd5e1" : "#475569",
                    }}
                    cursor={{
                      stroke: isDark ? "#475569" : "#94A3B8",
                      strokeWidth: 1,
                      strokeDasharray: "4 4",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: "#10B981",
                      strokeWidth: 2,
                      stroke: "#FFFFFF",
                    }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
                Select an assessment tab to view its score trend.
              </div>
            )}
          </div>
        </div>

        {/* Small List / Recommendations Sidebar */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 flex flex-col">
          <h2 className="mb-6 text-lg font-bold text-slate-800">
            Recommended for You
          </h2>

          <div className="flex-1 flex flex-col justify-center gap-4">
            <div className="rounded-xl bg-slate-50 p-4 shrink-0 transition-colors hover:bg-slate-100 cursor-pointer">
              <h4 className="font-semibold text-slate-800 text-sm">
                Guided Meditation
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                10-minute focus session
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 shrink-0 transition-colors hover:bg-slate-100 cursor-pointer">
              <h4 className="font-semibold text-slate-800 text-sm">
                Breathing Exercise
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Calm your nervous system
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 shrink-0 transition-colors hover:bg-slate-100 cursor-pointer">
              <h4 className="font-semibold text-slate-800 text-sm">
                Sleep Hygiene Tips
              </h4>
              <p className="text-xs text-slate-500 mt-1">Better rest tonight</p>
            </div>
          </div>

          <Link
            to="/recommendations"
            className="mt-4 text-center text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            View all suggestions
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
