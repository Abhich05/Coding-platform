import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { testService } from "../../services/testService";

type LoadedTest = {
  title: string;
  code: string;
  durationMinutes: number;
  totalMarks: number;
  questions: Array<{ prompt: string; options: string[] }>;
};

const TestPage = () => {
  const { code = "" } = useParams();
  const [test, setTest] = useState<LoadedTest | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await testService.getTestByCode(code);
        if (!mounted) return;
        setTest(data);
        setAnswers(new Array(data.questions.length).fill(""));
        setTimeLeft((data.durationMinutes || 30) * 60);
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.response?.data?.message || "Unable to load test");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [code]);

  useEffect(() => {
    if (!timeLeft) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleAnswer = (idx: number, option: string) => {
    const next = [...answers];
    next[idx] = option;
    setAnswers(next);
  };

  const answeredCount = useMemo(() => answers.filter(Boolean).length, [answers]);

  const submitTest = async () => {
    if (!test) return;
    setSubmitting(true);
    setSubmitMessage(null);
    try {
      await testService.submitTest(test.code, {
        answers,
        durationSeconds: (test.durationMinutes || 30) * 60 - timeLeft,
      });
      setSubmitMessage("Test submitted successfully.");
    } catch (err: any) {
      setSubmitMessage(err?.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="app-shell flex items-center justify-center p-8">
        <div className="surface-card px-6 py-4 text-sm muted-text">Loading test...</div>
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="app-shell flex items-center justify-center p-8">
        <div className="surface-card px-6 py-4 text-sm text-red-500">{error || "Test not found"}</div>
      </div>
    );
  }

  return (
    <div className="app-shell p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] muted-text">Test Code {test.code}</p>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">{test.title}</h1>
            <p className="muted-text mt-1">{test.questions.length} questions · {test.durationMinutes || 30} mins</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="surface-card px-4 py-3 text-sm font-semibold text-[var(--accent-strong)]">⏱ {formatTime(timeLeft)}</div>
            <div className="surface-card px-4 py-3 text-sm muted-text">Answered {answeredCount}/{test.questions.length}</div>
          </div>
        </div>

        <div className="space-y-4">
          {test.questions.map((q, idx) => (
            <div key={idx} className="surface-card p-5 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--accent-strong)] text-white flex items-center justify-center text-sm font-bold">{idx + 1}</div>
                <div>
                  <h2 className="text-[var(--text-primary)] font-semibold">{q.prompt}</h2>
                </div>
              </div>
              <div className="grid gap-2">
                {q.options.map((opt, optIdx) => (
                  <label
                    key={optIdx}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition ${answers[idx] === opt ? "border-[var(--accent-strong)] bg-[var(--bg-secondary)]" : "border-[var(--border)]"}`}
                  >
                    <input
                      type="radio"
                      name={`q-${idx}`}
                      checked={answers[idx] === opt}
                      onChange={() => handleAnswer(idx, opt)}
                    />
                    <span className="text-[var(--text-primary)]">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {submitMessage && (
            <div className={`text-sm ${submitMessage.includes("success") ? "text-green-500" : "text-red-500"}`}>
              {submitMessage}
            </div>
          )}
          <button
            onClick={submitTest}
            className="btn-solid px-6 py-3"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Test"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
