import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axios";
import { BookHeart, Plus, Loader2, Clock, ShieldCheck, Trash2, X, Brain, Sprout } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Journals = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJournal, setSelectedJournal] = useState(null);

  const prompts = [
    "What made you smile today?",
    "What is one thing you are grateful for right now?",
    "How did you handle a challenge today?",
    "What did you learn about yourself today?",
    "Write about a moment of peace you experienced.",
    "If you could describe your day in three words, what would they be and why?",
    "What is something you want to let go of today?",
    "Who is someone who made a positive impact on you recently?"
  ];

  const [activePrompt, setActivePrompt] = useState("");

  const generatePrompt = () => {
    const randomIndex = Math.floor(Math.random() * prompts.length);
    setActivePrompt(prompts[randomIndex]);
  };

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const res = await axiosInstance.get("/journal/all");
        setJournals(res.data.data || res.data || []);
      } catch (err) {
        console.error("Failed to load journals", err);
        setError("Ensure backend /api/journal/all is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchJournals();
  }, []);

  const handleDelete = async (e, id) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!window.confirm("Are you sure you want to permanently delete this journal entry?")) {
      return;
    }

    try {
      const res = await axiosInstance.delete(`/journal/delete/${id}`);
      if (res.data.success || res.status === 200) {
        setJournals(journals.filter((entry) => (entry._id || entry.id) !== id));
        if (selectedJournal && (selectedJournal._id === id || selectedJournal.id === id)) {
          setSelectedJournal(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete journal:", err);
      alert("Error deleting journal. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-20">
      <div className="flex flex-col items-center sm:flex-row sm:justify-between sm:items-end">
        <div>
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 dark:bg-slate-700/50">
            <Sprout size={28} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">
            My Mind Garden
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-lg flex items-center">
            <ShieldCheck size={16} className="text-emerald-500 mr-2 shrink-0" />
            Your thoughts are secure, encrypted, and yours alone.
          </p>
        </div>

        <Link
          to="/journal/new"
          className="mt-6 inline-flex items-center rounded-xl bg-orange-600 px-6 py-3 font-medium text-white shadow-sm transition-all hover:bg-orange-700 sm:mt-0 cursor-pointer"
        >
          <Plus size={20} className="mr-2" />
          Plant a Thought
        </Link>
      </div>

      {/* Interactive Prompt Card */}
      <div className="bg-orange-50/50 dark:bg-slate-800/40 border border-orange-100/50 dark:border-slate-700/50 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">Daily Reflection Prompt</p>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            {activePrompt || "Need inspiration? Grab a prompt to guide your reflection."}
          </p>
        </div>
        <button
          type="button"
          onClick={generatePrompt}
          className="shrink-0 px-5 py-2.5 text-xs font-semibold text-orange-700 dark:text-orange-400 bg-orange-100/60 dark:bg-slate-700/50 hover:bg-orange-200/80 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
        >
          {activePrompt ? "New Prompt" : "Inspire Me"}
        </button>
      </div>

      {error && (
        <p className="rounded-lg bg-orange-50 p-4 text-orange-600 text-sm font-medium">
          {error}
        </p>
      )}

      {journals.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center">
          <BookHeart size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-lg font-medium text-slate-800 dark:text-white">
            Your Mind Garden is waiting to grow
          </h3>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Start by planting your first reflection. Share your daily thoughts or write how your day was.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {journals.map((entry) => (
            <div
              key={entry._id || entry.id}
              onClick={() => setSelectedJournal(entry)}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 shadow-xs ring-1 ring-slate-100 hover:ring-slate-200 transition-all hover:shadow-md cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-xs font-medium text-slate-500">
                    <Clock size={14} className="mr-1" />
                    {new Date(entry.createdAt || entry.date).toLocaleDateString(
                      undefined,
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Emotion Pill */}
                    {entry.emotion && (
                      <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600 capitalize">
                        {entry.emotion}
                      </span>
                    )}
                    {/* Trash Button */}
                    <button
                      onClick={(e) => handleDelete(e, entry._id || entry.id)}
                      className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                      title="Delete Entry"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 line-clamp-1">
                  {entry.title || "Untitled Entry"}
                </h3>
                <p className="mt-2 text-sm text-slate-500 line-clamp-3 leading-relaxed whitespace-pre-wrap">
                  {entry.content?.replace(/(<([^>]+)>)/gi, "") || "No content provided."}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View/Read Modal */}
      <AnimatePresence>
        {selectedJournal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJournal(null)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1, transition: { type: "spring", damping: 25, stiffness: 220 } }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="relative z-10 w-full max-w-2xl mx-4 rounded-3xl bg-white p-6 md:p-8 shadow-2xl text-slate-800 max-h-[85vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedJournal(null)}
                className="absolute top-5 right-5 rounded-full p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>

              {/* Date & Metadata */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 mb-3">
                <div className="flex items-center">
                  <Clock size={14} className="mr-1.5" />
                  {new Date(selectedJournal.createdAt || selectedJournal.date).toLocaleDateString(
                    undefined,
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    }
                  )}
                </div>
                {selectedJournal.emotion && (
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-blue-600 capitalize">
                    Emotion: {selectedJournal.emotion}
                  </span>
                )}
                {selectedJournal.stressLevel !== undefined && (
                  <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-orange-600">
                    Stress Level: {selectedJournal.stressLevel}
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-slate-900 pr-10">
                {selectedJournal.title || "Untitled Entry"}
              </h2>

              {/* Content */}
              <div className="mt-6 text-slate-600 leading-relaxed whitespace-pre-wrap border-t border-slate-100 pt-6 max-h-[40vh] overflow-y-auto">
                {selectedJournal.content || "No content provided."}
              </div>

              {/* Action Footer */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={(e) => handleDelete(e, selectedJournal._id || selectedJournal.id)}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={16} />
                  Delete Entry
                </button>
                <button
                  onClick={() => setSelectedJournal(null)}
                  className="rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition-colors"
                >
                  Close View
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Journals;
