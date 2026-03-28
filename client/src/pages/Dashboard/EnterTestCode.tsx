import { useState } from "react";
import { useNavigate } from "react-router-dom";

const EnterTestCode = () => {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const startTest = () => {
    if (!code) return alert("Enter test code");
    navigate(`/test/${code}`);
  };

  return (
    <div className="bg-[#FDF4EE] p-6 rounded-2xl text-black">

      <h2 className="text-xl font-bold mb-4">
        Enter Test Code
      </h2>

      <input
        placeholder="Enter Test Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="input"
      />

      <button
        onClick={startTest}
        className="btn mt-4"
      >
        Start Test
      </button>
    </div>
  );
};

export default EnterTestCode;
