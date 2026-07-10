import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Sprout, 
  BotMessageSquare, 
  ClipboardCheck, 
  Stethoscope, 
  ShieldAlert, 
  ArrowRight,
  Shield,
  HeartHandshake,
  Lightbulb
} from "lucide-react";

import logoImg from "../assets/logo.png";

// Custom premium logo using logo.png from assets
export const PsykinLogo = ({ size = 48, className = "" }) => (
  <img 
    src={logoImg} 
    alt="Psykin Logo" 
    width={size} 
    height={size} 
    className={`object-contain ${className}`}
  />
);

const Landing = () => {
  const features = [
    {
      title: "Mind Garden",
      desc: "Nurture your self-reflection. Plant daily thoughts, logs, and experiences in your secure, encrypted journal.",
      icon: Sprout,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400",
    },
    {
      title: "AI Companion",
      desc: "Connect with our empathetic, intelligent chat assistant for listening ears and cognitive guidance anytime.",
      icon: BotMessageSquare,
      color: "text-purple-600 bg-purple-50 dark:bg-purple-950/20 dark:text-purple-400",
    },
    {
      title: "Wellness Assessments",
      desc: "Monitor your mental state with clinically validated screening tests for anxiety, depression, and stress.",
      icon: ClipboardCheck,
      color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20 dark:text-indigo-400",
    },
    {
      title: "Adaptive Recommendations",
      desc: "Get personalized action plans (breathing exercises, tailored journal prompts, and readings) generated dynamically based on your quiz scores.",
      icon: Lightbulb,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400",
    },
    {
      title: "Professional Directory",
      desc: "Consult nearby practitioners, counselors, and therapists. Access details and schedules seamlessly.",
      icon: Stethoscope,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/20 dark:text-blue-400",
    },
    {
      title: "Emergency SOS",
      desc: "Immediate access to official helpline details and custom interactive grounding exercises to support anxiety spikes.",
      icon: ShieldAlert,
      color: "text-red-600 bg-red-50 dark:bg-red-950/20 dark:text-red-400",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-slate-100 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <PsykinLogo size={40} className="group-hover:scale-105 transition-transform" />
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
              Psykin
            </span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Log In
            </Link>
            <Link 
              to="/register" 
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-emerald-500/10 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-32 flex flex-col items-center text-center relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100/50 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <HeartHandshake size={14} /> Your Secure Mind Companion
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
            Nurture Your Mind, <br />
            <span className="bg-linear-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
              One Thought at a Time
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Welcome to Psykin, a modern, secure sanctuary for your mental health. Refine daily journals in your Mind Garden, chat with an empathetic AI companion, and consult specialists.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/register" 
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Start Free Journey <ArrowRight size={18} />
            </Link>
            <Link 
              to="/login" 
              className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-100 dark:hover:bg-slate-900 transition-all flex items-center justify-center"
            >
              Go to Dashboard
            </Link>
          </div>

          <div className="pt-8 text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-2">
            <Shield size={14} className="text-emerald-500" /> End-to-End Encrypted Data & Local Anonymity
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="bg-white dark:bg-slate-900 py-20 md:py-28 border-y border-slate-100 dark:border-slate-800/60 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-4xl">
              Tended by Science, Grown with Care
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Psykin couples mental wellness routines with secure, modern interfaces. Explore our tools below.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => {
              const IconComp = feature.icon;
              return (
                <motion.div 
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group flex flex-col rounded-3xl bg-slate-50 dark:bg-slate-950 p-8 border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl transition-transform group-hover:scale-105 ${feature.color}`}>
                    <IconComp size={26} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1">
                    {feature.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-950 py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-400 dark:text-slate-500 text-sm">
          <div className="flex items-center gap-2">
            <PsykinLogo size={36} />
            <span className="font-bold text-slate-700 dark:text-slate-300">Psykin</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} Psykin. All rights reserved. Locally protected.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
