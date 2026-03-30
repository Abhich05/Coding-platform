import { useEffect, useState } from "react";
import { getAptitudeQuestions, submitAptitudeAnswers } from "../../../utils/api";

type Question = {
  id?: string;
  question: string;
  options: Record<string, string>;
  correct_answer?: string;
  topic?: string;
  difficulty?: number;
};

const TOTAL_TIME = 10 * 60; // 10 minutes

const Aptitude = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | null>>({});
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [submitted, setSubmitted] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  /* ================= FETCH QUESTIONS ================= */
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const data = await getAptitudeQuestions();
        setQuestions(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load questions");
        console.error("Error fetching questions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  /* ================= GLOBAL TIMER ================= */
  useEffect(() => {
    if (submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setSubmitted(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted]);

  /* ================= HELPERS ================= */
  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const attempted = Object.values(answers).filter((a) => a !== null).length;
  const skipped = questions.length - attempted;

  const score = questions.reduce((acc, q, i) => {
    return answers[i] === q.correct_answer ? acc + 1 : acc;
  }, 0);

  /* ================= HANDLE SUBMIT ================= */
  const handleSubmit = async () => {
    setSubmitLoading(true);
    try {
      const userId = localStorage.getItem("userId") || "anonymous";
      // Filter out null values (unanswered questions)
      const filteredAnswers = Object.fromEntries(
        Object.entries(answers).filter(([, val]) => val !== null)
      ) as Record<number, string>;
      const result = await submitAptitudeAnswers(userId, filteredAnswers);
      console.log("Submission result:", result);
    } catch (err) {
      console.error("Error submitting answers:", err);
    } finally {
      setSubmitLoading(false);
      setSubmitted(true);
    }
  };

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F25116] mx-auto"></div>
          <p className="text-white">Loading questions...</p>
        </div>
      </div>
    );
  }

  /* ================= ERROR STATE ================= */
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4 bg-red-500/10 p-8 rounded-lg border border-red-500">
          <p className="text-red-500 font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 rounded-lg bg-[#F25116] text-white font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  /* ================= RESULT VIEW ================= */
  if (submitted) {
    return (
      <div className="max-w-5xl mx-auto space-y-10">
        {/* SUMMARY */}
        <div className="bg-[#010440] border-4 border-[#F25116] rounded-3xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Test Summary 🎯
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white">
            <SummaryCard label="Total Questions" value={questions.length} />
            <SummaryCard label="Answered" value={attempted} />
            <SummaryCard label="Skipped" value={skipped} />
            <SummaryCard
              label="Score"
              value={`${score} / ${questions.length}`}
              highlight
            />
          </div>
        </div>

        {/* REVIEW */}
        <div className="space-y-8">
          {questions.map((q, i) => {
            const userAns = answers[i];

            return (
              <div
                key={i}
                className="bg-[#010440] p-6 rounded-2xl border border-white/10"
              >
                <h3 className="text-white font-semibold mb-4">
                  Q{i + 1}. {q.question}
                </h3>

                <div className="grid gap-3">
                  {Object.entries(q.options).map(([key, val]) => {
                    const isCorrect = key === q.correct_answer;
                    const isUserWrong =
                      userAns === key && key !== q.correct_answer;

                    return (
                      <div
                        key={key}
                        className={`
                          px-4 py-3 rounded-xl border text-white
                          ${
                            isCorrect
                              ? "border-emerald-500 bg-emerald-500/10"
                              : isUserWrong
                              ? "border-red-500 bg-red-500/10"
                              : "border-white/10"
                          }
                        `}
                      >
                        <span className="font-semibold mr-2">{key}.</span>
                        {val}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ================= TEST VIEW ================= */
  const q = questions[current];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-[#020F59] font-semibold">
          Question {current + 1} / {questions.length}
        </span>
        <span
          className={`font-semibold ${
            timeLeft <= 60 ? "text-[#F25116] animate-pulse" : "text-[#020F59]"
          }`}
        >
          ⏱ {formatTime(timeLeft)}
        </span>
      </div>

      {/* QUESTION */}
      <div className="bg-[#010440] p-8 rounded-3xl border-4 border-[#020F59] space-y-6">
        <h2 className="text-xl font-semibold text-white">{q.question}</h2>

        <div className="grid gap-4">
          {Object.entries(q.options).map(([key, val]) => (
            <button
              key={key}
              onClick={() =>
                setAnswers((prev) => ({ ...prev, [current]: key }))
              }
              className={`
                w-full text-left px-6 py-4 rounded-xl border-2 text-white
                ${
                  answers[current] === key
                    ? "border-[#F25116] bg-[#F25116]/10"
                    : "border-white/20 hover:border-[#F25116]"
                }
              `}
            >
              <span className="font-semibold mr-3">{key}.</span>
              {val}
            </button>
          ))}
        </div>

        {/* NAVIGATION */}
        <div className="flex justify-between pt-4">
          <button
            disabled={current === 0}
            onClick={() => setCurrent((c) => c - 1)}
            className="px-6 py-2 rounded-lg bg-white/10 text-white disabled:opacity-40"
          >
            ← Previous
          </button>

          {current === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={submitLoading}
              className="px-6 py-2 rounded-lg bg-[#F25116] text-white font-semibold disabled:opacity-60"
            >
              {submitLoading ? "Submitting..." : "Submit Test"}
            </button>
          ) : (
            <button
              onClick={() => setCurrent((c) => c + 1)}
              className="px-6 py-2 rounded-lg bg-[#F25116] text-white font-semibold"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Aptitude;

/* ================= SUMMARY CARD ================= */
const SummaryCard = ({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) => (
  <div
    className={`rounded-2xl p-4 border-2 text-center ${
      highlight
        ? "border-[#F25116] text-[#F25116]"
        : "border-white/20 text-white"
    }`}
  >
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-sm mt-1">{label}</div>
  </div>
);
