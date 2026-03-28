import { useState } from "react";
import { useNavigate } from "react-router-dom";

const EnterTest = () => {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const startTest = () => {
    if (!code) return alert("Enter code");

    navigate(`/test/${code}`);
  };

  return (
    <div className="bg-[#FDF4EE] text-black p-6 rounded-2xl">

      <h2 className="text-xl font-bold mb-4">
        Enter Test Code
      </h2>

      <input
        placeholder="Enter Test Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="input mb-4"
      />

      <button onClick={startTest} className="btn-primary">
        Start Test
      </button>
    </div>
  );
};

export default EnterTest;
