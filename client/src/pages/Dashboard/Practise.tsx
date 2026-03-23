// src/pages/Dashboard/Practise.tsx
import type { FC } from "react";
import { Link } from "react-router-dom";

const items = [
  { label: "Aptitude", path: "/dashboard/practise/aptitude", desc: "Maths, reasoning & logic" },
  { label: "DSA", path: "/dashboard/practise/dsa", desc: "Data structures & algorithms" },
  { label: "Test", path: "/dashboard/practise/test", desc: "Timed mock assessments" },
];

const Practise: FC = () => {
  return (
    <section className="space-y-6 text-gray-100">
      <h1 className="text-xl font-semibold">Practise</h1>
      <p className="text-gray-300">Choose a practice category</p>

      <div className="grid md:grid-cols-3 gap-4">
        {items.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className="block p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-white/10 hover:bg-white/5 transition-all"
          >
            <h2 className="text-lg font-semibold">{item.label}</h2>
            <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Practise;
