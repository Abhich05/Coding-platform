import { useState } from "react";
import { adminService } from "../../services/adminService";

interface TestQuestion {
  question: string;
  options: string[];
  answer: string;
  marks: number;
}

interface InviteStatus {
  type: "success" | "error";
  message: string;
}

interface SuccessModalProps {
  code: string;
  shareUrl: string;
  inviteEmail: string;
  setInviteEmail: React.Dispatch<React.SetStateAction<string>>;
  onSendInvite: () => void;
  sendingInvite: boolean;
  inviteStatus: InviteStatus | null;
}

const CreateTest = () => {
  const [test, setTest] = useState<{
    title: string;
    duration: string;
    questions: TestQuestion[];
  }>({
    title: "",
    duration: "",
    questions: [],
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [testCode, setTestCode] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [createdTestId, setCreatedTestId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteStatus, setInviteStatus] =
    useState<InviteStatus | null>(null);
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
          marks: 1,
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
      questions: test.questions.map((q) => ({
        question: q.question,
        options: q.options,
        answer: q.answer,
        marks: q.marks,
      })),
      code: generateCode(),
    };

    setSubmitting(true);

    try {
      const res = await adminService.createTest(payload);
      const data = res?.data ?? res;
      const body = data?.data ?? data;
      const code = body?.code ?? payload.code;

      const origin =
        typeof window !== "undefined"
          ? window.location.origin
          : "http://localhost:5173";

      const share = body?.shareUrl ?? `${origin}/test/${code}`;

      setTestCode(code);
      setShareUrl(share);
      setCreatedTestId(body?._id ?? "");
      setShowSuccess(true);

      setTest({ title: "", duration: "", questions: [] });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create test");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendInvite = async () => {
    if (!createdTestId) {
      setInviteStatus({
        type: "error",
        message: "Test was not created yet",
      });
      return;
    }

    if (!inviteEmail.trim()) {
      setInviteStatus({
        type: "error",
        message: "Enter an email address",
      });
      return;
    }

    setSendingInvite(true);
    setInviteStatus(null);

    try {
      await adminService.sendTestLink(
        createdTestId,
        inviteEmail.trim()
      );
      setInviteStatus({ type: "success", message: "Invite sent" });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setInviteStatus({
          type: "error",
          message: err.message,
        });
      } else {
        setInviteStatus({
          type: "error",
          message: "Failed to send invite",
        });
      }
    } finally {
      setSendingInvite(false);
    }
  };

  const totalMarks = test.questions.reduce(
    (sum, q) => sum + Number(q.marks || 0),
    0
  );

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-[var(--text-primary)]">
        Create Test
      </h1>

      {/* TEST DETAILS */}
      <div className="surface-card mb-8 p-6 rounded-2xl shadow-md">
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

        <p className="text-sm text-[var(--text-secondary)] font-medium">
          Total Marks: {totalMarks}
        </p>
      </div>

      {/* QUESTIONS */}
      <div className="space-y-6">
        {test.questions.map((q, i) => (
          <div
            key={i}
            className="surface-card p-6 rounded-2xl shadow-sm border border-[var(--border)]"
          >
            <input
              placeholder={`Question ${i + 1}`}
              className="input-field mb-4"
              value={q.question}
              onChange={(e) => {
                const newQ = [...test.questions];
                newQ[i].question = e.target.value;
                setTest({ ...test, questions: newQ });
              }}
            />

            {q.options.map((_, idx) => (
              <input
                key={idx}
                placeholder={`Option ${idx + 1}`}
                className="input-field mb-3"
                value={q.options[idx]}
                onChange={(e) => {
                  const newQ = [...test.questions];
                  newQ[i].options[idx] = e.target.value;
                  setTest({ ...test, questions: newQ });
                }}
              />
            ))}

            <input
              placeholder="Correct answer"
              className="input-field mb-3"
              value={q.answer}
              onChange={(e) => {
                const newQ = [...test.questions];
                newQ[i].answer = e.target.value;
                setTest({ ...test, questions: newQ });
              }}
            />

            <div>
              <label className="text-sm text-[var(--text-secondary)] mb-1 block">
                Marks for this question
              </label>
              <input
                type="number"
                min="1"
                placeholder="Enter marks"
                className="input-field"
                value={q.marks}
                onChange={(e) => {
                  const newQ = [...test.questions];
                  newQ[i].marks =
                    Number(e.target.value) || 1;
                  setTest({ ...test, questions: newQ });
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addQuestion}
        className="mt-6 btn-ghost text-lg"
      >
        + Add Question
      </button>

      {/* CREATE BUTTON */}
      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={handleCreateTest}
          className="btn-solid px-8 py-3 text-lg"
          disabled={submitting}
        >
          {submitting ? "Creating..." : "Create Test"}
        </button>

        {error && (
          <span className="text-red-500 text-sm">
            {error}
          </span>
        )}
      </div>

      {showSuccess && (
        <SuccessModal
          code={testCode}
          shareUrl={shareUrl}
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
}: SuccessModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="surface-card p-8 rounded-3xl w-96 shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-[var(--text-primary)]">
          Test Created Successfully ✅
        </h2>

        <p className="mb-3">
          Code: <b>{code}</b>
        </p>

        <input
          value={shareUrl}
          readOnly
          className="input-field mb-4"
        />

        <button
          onClick={() =>
            navigator.clipboard.writeText(shareUrl)
          }
          className="btn-solid w-full mb-3"
        >
          Copy Link
        </button>

        <input
          className="input-field mt-3"
          placeholder="Enter recipient email"
          value={inviteEmail}
          onChange={(e) =>
            setInviteEmail(e.target.value)
          }
        />

        <button
          className="btn-ghost w-full mt-3"
          onClick={onSendInvite}
          disabled={sendingInvite}
        >
          {sendingInvite ? "Sending..." : "Send Email"}
        </button>

        {inviteStatus && (
          <p
            className={`text-sm mt-3 ${
              inviteStatus.type === "success"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {inviteStatus.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default CreateTest;
