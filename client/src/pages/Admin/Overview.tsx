import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/useUserStore";
import { adminService } from "../../services/adminService";

/* ===========================
   Type Definitions
=========================== */

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: "admin" | "user";
}

interface Stats {
  totals?: {
    totalAdmins?: number;
    totalUsers?: number;
    jobsCount?: number;
    testsCount?: number;
  };
  recentUsers?: User[];
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

/* ===========================
   Component
=========================== */

const AdminOverview = () => {
  const navigate = useNavigate();
  const clearUser = useUserStore((state) => state.clearUser);

  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    clearUser();
    localStorage.removeItem("auth_token");
    navigate("/auth/signin", { replace: true });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, statsRes] = await Promise.all([
          adminService.getUsers(),
          adminService.getStats(),
        ]);

        setUsers(usersRes || []);
        setStats(statsRes || null);
      } catch (err: unknown) {
        const errorObj = err as ApiError;
        setError(
          errorObj?.response?.data?.message ||
            "Failed to load admin data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center p-10">
        <div className="surface-card px-6 py-4 text-sm muted-text">
          Loading admin dashboard...
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center p-10">
        <div className="surface-card px-6 py-4 text-sm text-red-500">
          {error}
        </div>
      </div>
    );

  const totals = stats?.totals || {};

  const totalAdmins =
    totals.totalAdmins ??
    users.filter((u) => u.role === "admin").length;

  const totalUsers =
    totals.totalUsers ??
    users.filter((u) => u.role === "user").length;

  const recentUsers =
    (stats?.recentUsers || users)
      .filter((u) => u.role === "user")
      .slice(0, 6);

  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          Admin Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="px-5 py-2 btn-solid text-xs"
        >
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Users" value={totalUsers} />
        <StatCard title="Admins" value={totalAdmins} />
        <StatCard title="Jobs Posted" value={totals.jobsCount ?? "-"} />
        <StatCard title="Tests" value={totals.testsCount ?? "-"} />
      </div>

      {/* Recent Users */}
      <div className="surface-card">
        <h2 className="text-xl font-bold mb-4 text-[var(--text-primary)]">
          Recent Users
        </h2>

        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)] text-left text-sm muted-text">
              <th className="py-3">Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>

          <tbody>
            {recentUsers.map((user) => (
              <tr
                key={user._id}
                className="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)] transition"
              >
                <td className="py-3 text-[var(--text-primary)]">
                  {user.fullName || "N/A"}
                </td>
                <td className="text-[var(--text-primary)]">
                  {user.email}
                </td>
                <td>
                  <span className="px-3 py-1 rounded-lg bg-green-200 text-green-800 text-xs">
                    user
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ===========================
   Stat Card Component
=========================== */

interface StatCardProps {
  title: string;
  value: string | number;
}

const StatCard = ({ title, value }: StatCardProps) => (
  <div
    className="
      surface-card p-6
      transition-all duration-300 ease-out
      hover:scale-105 hover:shadow-2xl
      hover:-translate-y-1
      cursor-pointer
      relative overflow-hidden
    "
  >
    <div className="absolute inset-0 opacity-0 hover:opacity-100 transition duration-300 bg-gradient-to-r from-[var(--accent)]/20 to-transparent"></div>

    <h3 className="muted-text mb-2 relative z-10">
      {title}
    </h3>

    <p className="text-2xl font-bold text-[var(--accent-strong)] relative z-10">
      {value}
    </p>
  </div>
);

export default AdminOverview;