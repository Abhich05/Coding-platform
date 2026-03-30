import { Link, Outlet, useLocation } from "react-router-dom";

const Practise = () => {
  const location = useLocation();
  const isIndex = location.pathname === "/dashboard/practise";

  return (
    <div className="bg-[#F2EEE9] p-6 md:p-10 rounded-3xl space-y-10">
      {/* Landing only on /dashboard/practise */}
      {isIndex && (
        <>
          {/* ================= HERO ================= */}
          <div className="bg-[#010440] text-white p-8 rounded-3xl border-4 border-[#F25116]">
            <h1 className="text-3xl font-bold">Practice Arena</h1>
            <p className="mt-2 text-gray-300 max-w-2xl">
              Build confidence with structured aptitude practice, DSA problem
              solving, and full-length mock tests.
            </p>
          </div>

          {/* ================= CARDS ================= */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* APTITUDE */}
            <Link
              to="aptitude"
              className="bg-white rounded-3xl p-6 border-4 border-[#F25116] hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#F25116] text-white flex items-center justify-center text-xl font-bold">
                  🧠
                </div>
                <span className="px-3 py-1 text-xs rounded-lg bg-[#F25116]/10 text-[#F25116] font-semibold">
                  MCQs
                </span>
              </div>

              <h2 className="mt-6 text-xl font-bold text-[#020F59]">
                Aptitude
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Logical reasoning, quantitative aptitude, and verbal ability.
              </p>

              <div className="mt-5 text-[#F25116] font-semibold">
                Start Practice →
              </div>
            </Link>

            {/* DSA */}
            <Link
              to="dsa"
              className="bg-white rounded-3xl p-6 border-4 border-[#020F59] hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#020F59] text-white flex items-center justify-center text-xl font-bold">
                  💻
                </div>
                <span className="px-3 py-1 text-xs rounded-lg bg-[#020F59]/10 text-[#020F59] font-semibold">
                  Problems
                </span>
              </div>

              <h2 className="mt-6 text-xl font-bold text-[#020F59]">
                DSA
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Practice Data Structures & Algorithms topic-wise.
              </p>

              <div className="mt-5 text-[#020F59] font-semibold">
                Explore Problems →
              </div>
            </Link>

            {/* TEST */}
            <Link
              to="test"
              className="bg-white rounded-3xl p-6 border-4 border-[#F25116] hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#F25116] text-white flex items-center justify-center text-xl font-bold">
                  📝
                </div>
                <span className="px-3 py-1 text-xs rounded-lg bg-[#F25116]/10 text-[#F25116] font-semibold">
                  Mock
                </span>
              </div>

              <h2 className="mt-6 text-xl font-bold text-[#020F59]">
                Test
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Full-length mock tests with real exam experience.
              </p>

              <div className="mt-5 text-[#F25116] font-semibold">
                Take Test →
              </div>
            </Link>
          </div>
        </>
      )}

      {/* ================= SUB ROUTES ================= */}
      <Outlet />
    </div>
  );
};

export default Practise;
