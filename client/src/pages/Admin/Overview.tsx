import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/useUserStore";

const AdminOverview = () => {
  const navigate = useNavigate();
  const clearUser = useUserStore((state) => state.clearUser);

  const [users, setUsers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("auth_token");

  const handleLogout = () => {
    clearUser();
    localStorage.removeItem("auth_token");
    navigate("/auth/signin", { replace: true });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await axios.get(
          "http://localhost:4000/api/admin/users",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUsers(usersRes.data.data || []);

        try {
          const jobsRes = await axios.get(
            "http://localhost:4000/api/jobs",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setJobs(jobsRes.data.data || []);
        } catch {
          console.log("Jobs API not available");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading)
    return (
      <div className="text-white p-10 text-xl">
        Loading dashboard...
      </div>
    );

  const totalAdmins = users.filter(u => u.role === "admin").length;
  const totalUsers = users.filter(u => u.role === "user").length;

  return (
    <div className="p-8 text-white">

      {/* Header with Logout */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="px-5 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition"
        >
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Users" value={totalUsers} />
        <StatCard title="Admins" value={totalAdmins} />
        <StatCard title="Jobs Posted" value={jobs.length} />
        <StatCard title="Platform Status" value="Active" />
      </div>

      {/* Recent Users Table */}
      <div className="bg-[#FDF4EE] text-black rounded-3xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          Recent Users
        </h2>

        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="py-3">Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>

          <tbody>
            {users
              .filter(u => u.role === "user")
              .slice(0, 6)
              .map((user, i) => (
                <tr key={i} className="border-b">
                  <td className="py-3">
                    {user.fullName || "N/A"}
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className="px-3 py-1 rounded-lg bg-green-200 text-green-800 text-sm">
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

const StatCard = ({ title, value }: any) => (
  <div
    className="
      bg-[#FDF4EE] text-black p-6 rounded-2xl shadow-md
      transition-all duration-300 ease-out
      hover:scale-105 hover:shadow-2xl
      hover:-translate-y-1
      cursor-pointer
      relative overflow-hidden
    "
  >
    {/* subtle gradient glow */}
    <div className="absolute inset-0 opacity-0 hover:opacity-100 transition duration-300 bg-gradient-to-r from-orange-200/40 to-transparent"></div>

    <h3 className="text-gray-600 mb-2 relative z-10">
      {title}
    </h3>

    <p className="text-2xl font-bold text-orange-600 relative z-10">
      {value}
    </p>
  </div>
);


export default AdminOverview;
