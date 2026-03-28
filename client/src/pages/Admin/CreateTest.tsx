import { useState } from "react";

const CreateTest = () => {
  const [test, setTest] = useState({
    title: "",
    duration: "",
    totalMarks: "",
    questions: [],
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [testCode, setTestCode] = useState("");

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

  const handleCreateTest = () => {
    const code = generateCode();
    setTestCode(code);
    setShowSuccess(true);

    // Later teammate connects API here:
    // axios.post("/create-test", { ...test, code });
  };

  return (
    <div className="p-8 text-white">

      <h1 className="text-3xl font-bold mb-6">
        Create Test
      </h1>

      {/* Test Details */}
      <div className="bg-[#FDF4EE] text-black rounded-3xl p-6 mb-6">
        <input
          placeholder="Test Title"
          className="input"
          onChange={(e) =>
            setTest({ ...test, title: e.target.value })
          }
        />

        <input
          placeholder="Duration (mins)"
          className="input"
          onChange={(e) =>
            setTest({ ...test, duration: e.target.value })
          }
        />

        <input
          placeholder="Total Marks"
          className="input"
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
            className="bg-[#FDF4EE] text-black p-5 rounded-2xl"
          >
            <input
              placeholder={`Question ${i + 1}`}
              className="input"
            />

            {q.options.map((_, idx) => (
              <input
                key={idx}
                placeholder={`Option ${idx + 1}`}
                className="input"
              />
            ))}
          </div>
        ))}
      </div>

      <button
        onClick={addQuestion}
        className="mt-4 bg-white text-black px-4 py-2 rounded-xl"
      >
        + Add Question
      </button>

      <button
        onClick={handleCreateTest}
        className="mt-6 block bg-orange-500 px-6 py-3 rounded-xl"
      >
        Create Test
      </button>

      {showSuccess && (
        <SuccessModal code={testCode} />
      )}
    </div>
  );
};

const SuccessModal = ({ code }: any) => {
  const link = `http://localhost:5173/test/${code}`;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center">

      <div className="bg-white p-8 rounded-2xl text-black w-96">

        <h2 className="text-xl font-bold mb-3">
          Test Created Successfully ✅
        </h2>

        <p>Code: <b>{code}</b></p>

        <input
          value={link}
          readOnly
          className="input mt-3"
        />

        <button
          onClick={() => navigator.clipboard.writeText(link)}
          className="btn mt-3"
        >
          Copy Link
        </button>

        <button className="btn mt-3">
          Send Email (Backend Later)
        </button>
      </div>
    </div>
  );
};

export default CreateTest;
