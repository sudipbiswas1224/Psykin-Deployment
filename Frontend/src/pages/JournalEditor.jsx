import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../api/axios";
import { BookHeart, ArrowLeft, Loader2, Save } from "lucide-react";

const JournalEditor = () => {
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!formData.title || !formData.content) return;
    setSaving(true);
    try {
      await axiosInstance.post("/journal/create", formData);
      navigate("/journal");
    } catch (err) {
      console.error(err);
      setError("Failed to save journal to backend.");
      // Offline fallback behavior during dev could be added here
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:py-12 animate-fade-in relative min-h-screen">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <Link
          to="/journal"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Mind Garden
        </Link>

        <button
          onClick={handleSave}
          disabled={saving || !formData.title || !formData.content}
          className="inline-flex items-center rounded-xl bg-orange-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-orange-700 disabled:opacity-50 cursor-pointer"
        >
          {saving ? (
            <Loader2 className="mr-2 animate-spin" size={16} />
          ) : (
            <Save className="mr-2" size={16} />
          )}
          Save to Garden
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Editor Area */}
      <div className="space-y-6">
        <input
          type="text"
          placeholder="Title this moment..."
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full bg-transparent text-4xl font-bold tracking-tight text-slate-800 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none"
        />

        <div className="h-px w-full bg-slate-100 dark:bg-slate-800" />

        <textarea
          placeholder="How was your day? Share your daily thoughts, feelings, or whatever is on your mind..."
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          className="h-[60vh] w-full resize-none border-none bg-transparent text-lg text-slate-600 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-0 leading-loose"
        />
      </div>
    </div>
  );
};

export default JournalEditor;
