import { useEffect, useState } from "react";
import axios from "axios";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("auth_token");

      const res = await axios.get(
        "http://localhost:4000/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(res.data.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 text-white">

      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold mb-6">
        Manage Users
      </h1>

      {/* SEARCH + STATS */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search users..."
          className="px-4 py-2 rounded-lg text-black w-72"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="bg-[#FDF4EE] text-black px-6 py-3 rounded-xl shadow">
          Total Users:{" "}
          <span className="font-bold text-orange-600">
            {filteredUsers.length}
          </span>
        </div>
      </div>

      {/* USER TABLE */}
      <div className="bg-[#FDF4EE] rounded-3xl p-6 shadow-lg text-black overflow-auto">

        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-3">User</th>
              <th>Email</th>
              <th>Role</th>
              <th>User ID</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user._id}
                className="border-b hover:bg-orange-50 transition"
              >
                {/* Avatar + Name */}
                <td className="py-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
                    {user.fullName
                      ? user.fullName.charAt(0)
                      : user.email.charAt(0)}
                  </div>

                  {user.fullName || "User"}
                </td>

                <td>{user.email}</td>

                {/* ROLE BADGE */}
                <td>
                  <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {user.role}
                  </span>
                </td>

                <td className="text-xs text-gray-600">
                  {user._id}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <p className="text-center mt-6 text-gray-500">
            No users found
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
