import { useEffect, useState } from "react";
import { adminService } from "../../services/adminService";

const TestResults = () => {
  const [tests, setTests] = useState<any[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<string>("");
  const [results, setResults] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Format seconds -> mm:ss
  const formatTime = (sec?: number) => {
    if (!sec && sec !== 0) return "-";
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await adminService.listTests();
        const list = res || [];
        setTests(list);
        if (list.length > 0) {
          setSelectedTestId(list[0]._id);
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || "Unable to load tests");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (!selectedTestId) return;
      setError(null);
      try {
        const res = await adminService.getTestResults(selectedTestId);
        setResults(res);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Unable to load results");
      }
    };
    fetchResults();
  }, [selectedTestId]);

  const summary = results?.summary || {
    attempts: 0,
    averageScore: 0,
    maxScore: 0,
  };

  const attempts = results?.attempts || [];

  if (loading) {
    return (
      <div className="p-8">
        <div className="surface-card px-6 py-4 text-sm muted-text">
          Loading tests...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="surface-card px-6 py-4 text-sm text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Test Analytics
        </h1>

        <select
          className="input-field max-w-xs"
          value={selectedTestId}
          onChange={(e) => setSelectedTestId(e.target.value)}
        >
          {tests.map((t) => (
            <option key={t._id} value={t._id}>
              {`${t.title} (${t.code})`}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="surface-card p-6">
          <p className="text-sm muted-text mb-2">Total Attempts</p>
          <p className="text-2xl font-bold text-[var(--accent-strong)]">
            {summary.attempts}
          </p>
        </div>

        <div className="surface-card p-6">
          <p className="text-sm muted-text mb-2">Avg Score</p>
          <p className="text-2xl font-bold text-[var(--accent-strong)]">
            {summary.averageScore?.toFixed?.(1) ?? 0}
          </p>
        </div>

        <div className="surface-card p-6">
          <p className="text-sm muted-text mb-2">Top Score</p>
          <p className="text-2xl font-bold text-[var(--accent-strong)]">
            {summary.maxScore}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="surface-card overflow-auto">
        <h2 className="font-semibold mb-4 text-[var(--text-primary)] px-4 pt-4">
          Student Results
        </h2>

        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)] text-sm muted-text">
              <th className="text-left py-3 px-4">Name</th>
              <th className="text-left py-3 px-4">Email</th>
              <th className="text-left py-3 px-4">Score</th>
              <th className="text-left py-3 px-4">Time Taken</th>
              <th className="text-left py-3 px-4">Submitted</th>
            </tr>
          </thead>

          <tbody>
            {attempts.map((a: any) => (
              <tr
                key={a._id}
                className="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)] transition"
              >
                <td className="py-3 px-4 text-[var(--text-primary)]">
                  {a.userId?.fullName || a.respondentName || "Guest"}
                </td>

                <td className="py-3 px-4 text-[var(--text-primary)]">
                  {a.userId?.email || a.respondentEmail || ""}
                </td>

                <td className="py-3 px-4 text-[var(--text-primary)]">
                  {a.score}/{a.totalMarks}
                </td>

                <td className="py-3 px-4 text-[var(--text-primary)]">
                  {formatTime(a.durationSeconds)}
                </td>

                <td className="py-3 px-4 text-[var(--text-primary)]">
                  {new Date(a.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}

            {attempts.length === 0 && (
              <tr>
                <td
                  className="py-4 px-4 text-sm muted-text"
                  colSpan={5}
                >
                  No attempts yet for this test
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestResults;
