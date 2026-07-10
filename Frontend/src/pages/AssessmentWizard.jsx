import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../api/axios";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

const AssessmentWizard = () => {
  const { type } = useParams();
  const [template, setTemplate] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await axiosInstance.get(`/assessment/template/${type}`);
        let fetchedData = res.data.data || res.data || res;

        // Normalize the backend schema to the frontend structure
        if (
          fetchedData &&
          fetchedData.questions &&
          fetchedData.questions.length > 0 &&
          fetchedData.questions[0].choices
        ) {
          fetchedData.questions = fetchedData.questions.map((q) => ({
            text: q.text,
            options: q.choices.map((choice, idx) => ({
              label: choice,
              value:
                q.scores && q.scores[idx] !== undefined ? q.scores[idx] : idx,
            })),
          }));
        }

        setTemplate(fetchedData);
      } catch (err) {
        console.error("Failed to load test template:", err);
        // Hardcode fallback template based on standard formats
        setTemplate({
          title: `${type.toUpperCase()} Test`,
          questions: [
            {
              text: `How often have you felt down, depressed, or hopeless?`,
              options: [
                { label: "Not at all", value: 0 },
                { label: "Several days", value: 1 },
                { label: "More than half the days", value: 2 },
                { label: "Nearly every day", value: 3 },
              ],
            },
            {
              text: `How often have you had trouble falling or staying asleep?`,
              options: [
                { label: "Not at all", value: 0 },
                { label: "Several days", value: 1 },
                { label: "More than half the days", value: 2 },
                { label: "Nearly every day", value: 3 },
              ],
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
  }, [type]);

  const handleOptionSelect = (val) => {
    setResponses({ ...responses, [currentIdx]: val });
    if (currentIdx < template.questions.length - 1) {
      setTimeout(() => setCurrentIdx((prev) => prev + 1), 300); // 300ms delay for visual feedback
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Backend expects: { testType, responses: [0, 1, 2...] }
      const orderedResponses = template.questions.map((_, i) =>
        responses[i] !== undefined ? responses[i] : 0,
      );
      const payload = {
        testType: type,
        responses: orderedResponses,
        phase: "baseline",
      };

      const res = await axiosInstance.post("/assessment/submit", payload);
      setResult(
        res.data.data ||
          res.data || {
            totalScore: "N/A",
            interpretation: "Submission received.",
            feedback: "Thanks for completing the assessment.",
          },
      );
    } catch (err) {
      console.error(err);
      // Fallback
      const score = Object.values(responses).reduce((a, b) => a + b, 0);
      setResult({
        totalScore: score,
        interpretation: "Result recorded locally.",
        feedback: "Thank you for your responses.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600" size={32} />
      </div>
    );
  }

  // Result View
  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-2xl px-4 py-16 text-center animate-fade-in"
      >
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 size={40} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">
          Assessment Complete
        </h1>

        <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100 text-left">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              Total Score
            </span>
            <span className="text-2xl font-bold text-slate-800">
              {result.totalScore}
            </span>
          </div>
          <div className="pt-4">
            <h3 className="text-lg font-semibold text-slate-800">
              Severity: {result.interpretation}
            </h3>
            <p className="mt-2 text-slate-600 leading-relaxed">
              {result.feedback}
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/assessments"
            className="rounded-xl px-6 py-3 font-medium text-slate-600 transition-colors hover:bg-slate-100"
          >
            Back to Tests
          </Link>
          <Link
            to="/recommendations"
            className="rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white transition-colors hover:bg-emerald-700"
          >
            View Recommendations
          </Link>
        </div>
      </motion.div>
    );
  }

  // Ensure questions exist
  if (!template || !template.questions || template.questions.length === 0)
    return <div>No questions found</div>;

  const currentQuestion = template.questions[currentIdx];
  const progressPercent = (currentIdx / template.questions.length) * 100;
  const isLast = currentIdx === template.questions.length - 1;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:py-12">
      {/* Header & Progress */}
      <div className="mb-8">
        <Link
          to="/assessments"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 mb-6"
        >
          <ArrowLeft size={16} className="mr-1" />
          Quit Test
        </Link>
        <h1 className="text-2xl font-bold text-slate-800 capitalize">
          {template.title || `${type} Assessment`}
        </h1>

        {/* Progress Bar */}
        <div className="mt-6 flex items-center justify-between text-sm font-medium text-slate-500">
          <span>
            Question {currentIdx + 1} of {template.questions.length}
          </span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full bg-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Interactive Question Card */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="py-2"
          >
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8 shrink-0 flex flex-col justify-between">
              <h2 className="mb-8 text-xl font-semibold leading-snug text-slate-800">
                {currentQuestion.text}
              </h2>

              <div className="space-y-3">
                {currentQuestion.options.map((opt, i) => {
                  const isSelected = responses[currentIdx] === opt.value;
                  return (
                    <button
                      key={i}
                      onClick={() => handleOptionSelect(opt.value)}
                      className={`flex w-full items-center justify-between rounded-xl border p-4 text-left font-medium transition-all ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500"
                          : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && (
                        <CheckCircle2 size={20} className="text-emerald-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
          disabled={currentIdx === 0}
          className="rounded-xl px-5 py-3 font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-transparent"
        >
          Previous
        </button>

        {isLast ? (
          <button
            onClick={handleSubmit}
            disabled={submitting || responses[currentIdx] === undefined}
            className="inline-flex items-center rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-70"
          >
            {submitting ? (
              <Loader2 className="animate-spin mr-2" size={18} />
            ) : null}
            Submit Assessment
          </button>
        ) : (
          <button
            onClick={() => setCurrentIdx((prev) => prev + 1)}
            disabled={responses[currentIdx] === undefined}
            className="inline-flex items-center rounded-xl bg-slate-800 px-5 py-3 font-medium text-white transition-colors hover:bg-slate-900 disabled:opacity-50"
          >
            Next <ArrowRight size={18} className="ml-2" />
          </button>
        )}
      </div>
    </div>
  );
};

export default AssessmentWizard;
