import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import {
  Loader2,
  Sparkles,
  Lightbulb,
  HeartPulse,
  Video,
  BookOpen,
  Music,
} from "lucide-react";

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const res = await axiosInstance.get("/recommendations/personalized");

        let allRecs = [];
        const data = res.data.data;
        if (data) {
          if (data.activities) allRecs = [...allRecs, ...data.activities];
          if (data.articles) allRecs = [...allRecs, ...data.articles];
          if (data.videos) allRecs = [...allRecs, ...data.videos];
          if (data.music) allRecs = [...allRecs, ...data.music];
        }

        setRecommendations(allRecs);
        
      } catch (err) {
        console.error(err);
        // Fallback dummy data
        setRecommendations([
          {
            _id: "1",
            type: "activity",
            title: "5-4-3-2-1 Grounding",
            description:
              "Identify 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste.",
          },
          {
            _id: "2",
            type: "video",
            title: "Guided Breathing",
            description:
              "A short 3-minute video to help lower your heart rate and ease anxiety.",
            url: "#",
          },
          {
            _id: "3",
            type: "music",
            title: "Deep Focus Playlist",
            description:
              "Ambient beats proven to help enhance focus while minimizing stress.",
            url: "#",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
  }, []);

  const getIconForType = (type) => {
    switch (type) {
      case "activity":
        return <HeartPulse className="text-rose-500" size={24} />;
      case "video":
        return <Video className="text-blue-500" size={24} />;
      case "article":
        return <BookOpen className="text-indigo-500" size={24} />;
      case "music":
        return <Music className="text-purple-500" size={24} />;
      default:
        return <Lightbulb className="text-amber-500" size={24} />;
    }
  };

  const getBgForType = (type) => {
    switch (type) {
      case "activity":
        return "bg-rose-50 ring-rose-100";
      case "video":
        return "bg-blue-50 ring-blue-100";
      case "article":
        return "bg-indigo-50 ring-indigo-100";
      case "music":
        return "bg-purple-50 ring-purple-100";
      default:
        return "bg-amber-50 ring-amber-100";
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
          <Sparkles size={28} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 md:text-4xl">
          Personalized For You
        </h1>
        <p className="mt-3 text-slate-500 max-w-2xl">
          Based on your recent assessment scores and journal insights, here are
          highly curated suggestions to boost your wellbeing today.
        </p>
      </div>

      {/* Grid */}
      {recommendations && recommendations.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((rec) => (
            <div
              key={rec._id || rec.title}
              className="flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md hover:ring-slate-200"
            >
              <div>
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ring-1 ${getBgForType(rec.type)}`}
                >
                  {getIconForType(rec.type)}
                </div>
                <h3 className="text-lg font-semibold text-slate-800">
                  {rec.title}
                </h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed text-balance">
                  {rec.description || rec.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-50">
                {rec.url ? (
                  <a
                    href={rec.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700 inline-block py-1"
                  >
                    Access Material &rarr;
                  </a>
                ) : (
                  <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700 py-1">
                    Start Practice &rarr;
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 rounded-2xl ring-1 ring-slate-100 bg-white">
          <p className="text-slate-500">
            No personalized recommendations available at the moment.
          </p>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
