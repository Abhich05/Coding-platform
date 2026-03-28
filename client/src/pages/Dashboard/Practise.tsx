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
    <section className="space-y-8">
      
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Practice
        </h1>
        <p className="muted-text mt-1">
          Choose a practice category
        </p>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className="
              surface-card group
              hover:scale-[1.02]
              hover:border-[var(--accent-strong)]
              transition-all duration-200
            "
          >
            <h2 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-strong)]">
              {item.label}
            </h2>

            <p className="text-sm muted-text mt-2">
              {item.desc}
            </p>

            {/* subtle accent bar */}
            <div className="h-[3px] w-10 mt-4 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-strong)] rounded-full opacity-70 group-hover:w-16 transition-all" />
          </Link>
        ))}
      </div>

    </section>
  );
};

export default Practise;
