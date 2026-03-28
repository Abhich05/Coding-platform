const TestResults = () => {
  const students = [
    { name: "Anvesh", score: 18 },
    { name: "Vamshi", score: 15 },
    { name: "Darshan", score: 12 },
  ];

  const avg =
    students.reduce((a, s) => a + s.score, 0) /
    students.length;

  return (
    <div className="text-white p-8">

      <h1 className="text-2xl font-bold mb-6">
        Test Analytics
      </h1>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white text-black p-6 rounded-xl">
          Total Attempts: {students.length}
        </div>

        <div className="bg-white text-black p-6 rounded-xl">
          Avg Score: {avg.toFixed(1)}
        </div>

        <div className="bg-white text-black p-6 rounded-xl">
          Topper: {students[0].name}
        </div>

      </div>

      {/* Table */}
      <div className="bg-white text-black rounded-xl p-6">
        <h2 className="font-semibold mb-4">
          Student Results
        </h2>

        <table className="w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s, i) => (
              <tr key={i}>
                <td>{s.name}</td>
                <td>{s.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestResults;
