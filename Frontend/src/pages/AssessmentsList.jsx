import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axios";
import { ClipboardCheck, Loader2, ArrowRight } from "lucide-react";

// Hardcoded meta-info to enrich the raw test IDs returned by the backend
const testMeta = {
  phq9: {
    title: "Depression Quiz",
    desc: "Patient Health Questionnaire (PHQ-9) to measure depression severity.",
    color: "from-blue-500 to-blue-600",
  },
  gad7: {
    title: "Anxiety Quiz",
    desc: "Generalized Anxiety Disorder (GAD-7) to measure anxiety levels.",
    color: "from-orange-500 to-orange-600",
  },
  pss: {
    title: "Stress Quiz",
    desc: "Perceived Stress Scale (PSS) to measure how stressful situations seem.",
    color: "from-red-500 to-red-600",
  },
  who5: {
    title: "Wellbeing Quiz",
    desc: "WHO-5 Well-Being Index to measure overall happiness and well-being.",
    color: "from-emerald-500 to-emerald-600",
  },
  isi: {
    title: "Insomnia Quiz",
    desc: "Insomnia Severity Index (ISI) to measure sleep problems.",
    color: "from-indigo-500 to-indigo-600",
  },
};

const AssessmentsList = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await axiosInstance.get("/assessment/tests");
        // Assuming backend returns ['phq9', 'gad7', ...]
        setTests(res.data.data || res.data || []);
      } catch (err) {
        console.error("Failed to load tests:", err);
        // Fallback for UI if backend isn't seeded yet
        setTests(["phq9", "gad7", "pss", "who5", "isi"]);
        setError("Using fallback list as backend may not be available.");
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto pb-20">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <ClipboardCheck size={28} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 md:text-4xl">
          Mental Health Assessments
        </h1>
        <p className="mt-3 text-slate-500 max-w-xl">
          Clinically validated tests to help you understand your current
          emotional state. Choose a test below to begin.
        </p>
      </div>

      {error && <p className="text-center text-sm text-orange-500">{error}</p>}

      <div className="grid gap-6 sm:grid-cols-2">
        {tests.map((testId) => {
          const type = testId.toLowerCase();
          const meta = testMeta[type] || {
            title: testId,
            desc: "A standardized psychological assessment.",
            color: "from-slate-500 to-slate-600",
          };

          return (
            <Link
              key={testId}
              to={`/assessments/${testId}`}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md hover:ring-slate-200"
            >
              <div className={`h-2 w-full bg-linear-to-r ${meta.color}`} />
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800">
                  {meta.title}
                </h3>
                <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                  {meta.desc}
                </p>
                <div className="mt-6 flex items-center font-medium text-indigo-600 group-hover:text-indigo-700">
                  Start Assessment <ArrowRight size={18} className="ml-1" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AssessmentsList;
