import { useState } from "react";
import { adminService } from "../../services/adminService";

interface TestQuestion {
  question: string;
  options: string[];
  answer: string;
}

const CreateTest = () => {
  const [test, setTest] = useState<{
    title: string;
    duration: string;
    totalMarks: string;
    questions: TestQuestion[];
  }>({
    title: "",
    duration: "",
    totalMarks: "",
    questions: [],
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [testCode, setTestCode] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [createdTestId, setCreatedTestId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteStatus, setInviteStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [sendingInvite, setSendingInvite] = useState(false);

  const generateCode = () =>
    "TST" + Math.floor(1000 + Math.random() * 9000);

  const addQuestion = () => {
    setTest({
      ...test,
      questions: [
        ...test.questions,
        {
          question: "",
          options: ["", "", "", ""],
          answer: "",
        },
      ],
    });
  };

  const handleCreateTest = async () => {
    setError(null);

    if (!test.title || test.questions.length === 0) {
      setError("Title and at least one question are required");
      return;
    }

    const payload = {
      title: test.title,
      durationMinutes: Number(test.duration) || 30,
      totalMarks: Number(test.totalMarks) || test.questions.length,
      questions: test.questions.map((q) => ({
        question: q.question,
        options: q.options,
        answer: q.answer,
      })),
      code: generateCode(),
    };

    setSubmitting(true);
    try {
      const res = await adminService.createTest(payload);
      const data = res?.data || res; // service returns success + data
      const body = data?.data || data; // prefer nested data
      const code = body?.code || payload.code;
      const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:5173";
      const share = body?.shareUrl || `${origin}/test/${code}`;
      setTestCode(code);
      setShareUrl(share);
      setCreatedTestId(body?._id || "");
      setShowSuccess(true);
      setInviteEmail("");
      setInviteStatus(null);
      // reset form
      setTest({ title: "", duration: "", totalMarks: "", questions: [] });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create test");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendInvite = async () => {
    if (!createdTestId) {
      setInviteStatus({ type: "error", message: "Test was not created yet" });
      return;
    }
    if (!inviteEmail.trim()) {
      setInviteStatus({ type: "error", message: "Enter an email address" });
      return;
    }
    setSendingInvite(true);
    setInviteStatus(null);
    try {
      await adminService.sendTestLink(createdTestId, inviteEmail.trim());
      setInviteStatus({ type: "success", message: "Invite sent" });
    } catch (err: any) {
      setInviteStatus({ type: "error", message: err?.response?.data?.message || "Failed to send invite" });
    } finally {
      setSendingInvite(false);
    }
  };

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6 text-[var(--text-primary)]">
        Create Test
      </h1>

      {/* Test Details */}
      <div className="surface-card mb-6">
        <input
          placeholder="Test Title"
          className="input-field mb-4"
          value={test.title}
          onChange={(e) =>
            setTest({ ...test, title: e.target.value })
          }
        />

        <input
          placeholder="Duration (mins)"
          className="input-field mb-4"
          value={test.duration}
          onChange={(e) =>
            setTest({ ...test, duration: e.target.value })
          }
        />

        <input
          placeholder="Total Marks"
          className="input-field"
          value={test.totalMarks}
          onChange={(e) =>
            setTest({ ...test, totalMarks: e.target.value })
          }
        />
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {test.questions.map((q, i) => (
          <div
            key={i}
            className="surface-card p-5"
          >
            <input
              placeholder={`Question ${i + 1}`}
              className="input-field mb-3"
              value={q.question}
              onChange={(e) => {
                const newQuestions = [...test.questions];
                newQuestions[i].question = e.target.value;
                setTest({ ...test, questions: newQuestions });
              }}
            />

            {q.options.map((_, idx) => (
              <input
                key={idx}
                placeholder={`Option ${idx + 1}`}
                className="input-field mb-2"
                value={q.options[idx]}
                onChange={(e) => {
                  const newQuestions = [...test.questions];
                  newQuestions[i].options[idx] = e.target.value;
                  setTest({ ...test, questions: newQuestions });
                }}
              />
            ))}
            <input
              placeholder="Correct answer (must match an option)"
              className="input-field"
              value={q.answer}
              onChange={(e) => {
                const newQuestions = [...test.questions];
                newQuestions[i].answer = e.target.value;
                setTest({ ...test, questions: newQuestions });
              }}
            />
          </div>
        ))}
      </div>

      <button
        onClick={addQuestion}
        className="mt-4 btn-ghost"
      >
        + Add Question
      </button>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={handleCreateTest}
          className="btn-solid"
          disabled={submitting}
        >
          {submitting ? "Creating..." : "Create Test"}
        </button>
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>

      {showSuccess && (
        <SuccessModal
          code={testCode}
          shareUrl={shareUrl || `http://localhost:5173/test/${testCode}`}
          inviteEmail={inviteEmail}
          setInviteEmail={setInviteEmail}
          onSendInvite={handleSendInvite}
          sendingInvite={sendingInvite}
          inviteStatus={inviteStatus}
        />
      )}
    </div>
  );
};

const SuccessModal = ({
  code,
  shareUrl,
  inviteEmail,
  setInviteEmail,
  onSendInvite,
  sendingInvite,
  inviteStatus,
}: any) => {

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">

      <div className="surface-card p-8 rounded-2xl w-96">

        <h2 className="text-xl font-bold mb-3 text-[var(--text-primary)]">
          Test Created Successfully ✅
        </h2>

        <p className="text-[var(--text-primary)] mb-3">Code: <b className="text-[var(--accent-strong)]">{code}</b></p>

        <input
          value={shareUrl}
          readOnly
          className="input-field mb-3"
        />

        <button
          onClick={() => navigator.clipboard.writeText(shareUrl)}
          className="btn-solid w-full mb-2 text-sm"
        >
          Copy Link
        </button>

        <div className="space-y-2 mt-3">
          <input
            className="input-field"
            placeholder="Enter recipient email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          <button
            className="btn-ghost w-full text-sm"
            onClick={onSendInvite}
            disabled={sendingInvite}
          >
            {sendingInvite ? "Sending..." : "Send Email"}
          </button>
          {inviteStatus && (
            <p className={`text-sm ${inviteStatus.type === "success" ? "text-green-500" : "text-red-500"}`}>
              {inviteStatus.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateTest;
