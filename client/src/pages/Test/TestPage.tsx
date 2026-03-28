import { useState, useEffect } from "react";

const mockQuestions = [
  {
    id: 1,
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
  },
  {
    id: 2,
    question: "Which is NOT a JS framework?",
    options: ["React", "Angular", "Django", "Vue"],
  },
];

const TestPage = () => {
  const [answers, setAnswers] = useState<any>({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 mins

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleAnswer = (qid: number, option: string) => {
    setAnswers({ ...answers, [qid]: option });
  };

  const submitTest = () => {
    alert("Test submitted!");
  };

  return (
    <div className="min-h-screen bg-[#02043A] text-white p-8">

      {/* Header */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Placement Test</h1>
        <div className="bg-orange-500 px-4 py-2 rounded-lg font-semibold">
          ⏱ {formatTime(timeLeft)}
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {mockQuestions.map((q) => (
          <div
            key={q.id}
            className="bg-white text-black rounded-2xl p-6"
          >
            <h2 className="font-semibold mb-4">
              {q.id}. {q.question}
            </h2>

            {q.options.map((opt) => (
              <label
                key={opt}
                className="block mb-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  checked={answers[q.id] === opt}
                  onChange={() =>
                    handleAnswer(q.id, opt)
                  }
                  className="mr-2"
                />
                {opt}
              </label>
            ))}
          </div>
        ))}
      </div>

      {/* Submit */}
      <button
        onClick={submitTest}
        className="mt-8 bg-orange-500 px-8 py-3 rounded-xl font-semibold hover:bg-orange-600"
      >
        Submit Test
      </button>
    </div>
  );
};

export default TestPage;
