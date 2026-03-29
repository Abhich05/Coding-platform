const TestResult = () => {
  const result = {
    score: 18,
    total: 20,
    accuracy: "90%",
    rank: 12,
  };

  return (
    <div className="min-h-screen bg-[#02043A] flex items-center justify-center text-white">

      <div className="bg-white text-black rounded-3xl p-10 w-[400px] text-center">

        <h1 className="text-2xl font-bold mb-6">
          Test Result 🎉
        </h1>

        <p className="text-xl font-semibold mb-2">
          Score: {result.score}/{result.total}
        </p>

        <p>Accuracy: {result.accuracy}</p>
        <p>Rank: #{result.rank}</p>

        <button className="mt-6 bg-orange-500 text-white px-6 py-2 rounded-xl">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default TestResult;
