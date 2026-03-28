import { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";

interface JobPayload {
  title: string;
  company: string;
  location: string;
  description: string;
  tags: string;
}

const AdminJobs = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<JobPayload>({
    title: "",
    company: "",
    location: "",
    description: "",
    tags: "",
  });

  const fetchJobs = async () => {
    try {
      const res = await axiosInstance.get("/jobs");
      setJobs(res.data.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCreate = async () => {
    if (!form.title || !form.company) {
      setError("Title and company are required");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        title: form.title,
        company: form.company,
        location: form.location,
        description: form.description,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };
      await axiosInstance.post("/jobs", payload);
      await fetchJobs();
      setForm({ title: "", company: "", location: "", description: "", tags: "" });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to create job");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Manage Jobs</h1>
      </div>

      {/* Create Job */}
      <div className="surface-card p-6 space-y-3">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Post a Job</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <input
            className="input-field"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            className="input-field"
            placeholder="Company"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />
          <input
            className="input-field"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
          <input
            className="input-field"
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
        </div>
        <textarea
          className="input-field"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div className="flex items-center gap-3">
          <button className="btn-solid" onClick={handleCreate} disabled={submitting}>
            {submitting ? "Publishing..." : "Publish Job"}
          </button>
          {error && <span className="text-sm text-red-500">{error}</span>}
        </div>
      </div>

      {/* Jobs Table */}
      <div className="surface-card overflow-auto">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
          <h2 className="font-semibold text-[var(--text-primary)]">All Jobs</h2>
          {loading && <span className="text-sm muted-text">Loading...</span>}
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)] text-left text-sm muted-text">
              <th className="py-3 px-4">Title</th>
              <th className="px-4">Company</th>
              <th className="px-4">Location</th>
              <th className="px-4">Tags</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id} className="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)] transition">
                <td className="py-3 px-4 text-[var(--text-primary)]">{job.title}</td>
                <td className="px-4 text-[var(--text-primary)]">{job.company}</td>
                <td className="px-4 text-[var(--text-primary)]">{job.location}</td>
                <td className="px-4">
                  <div className="flex gap-2 flex-wrap">
                    {(job.tags || []).map((t: string) => (
                      <span key={t} className="px-2 py-1 rounded bg-[var(--bg-secondary)] text-xs text-[var(--text-primary)]">
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            {!loading && jobs.length === 0 && (
              <tr>
                <td className="py-4 px-4 text-sm muted-text" colSpan={4}>No jobs posted yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminJobs;
