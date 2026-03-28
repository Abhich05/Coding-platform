import { useEffect, useState } from "react";
import { adminService } from "../../services/adminService";

const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await adminService.getUsers();
      setUsers(res || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to load users");
    }
    setLoading(false);
  };

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-8">
        <div className="surface-card px-6 py-4 text-sm muted-text">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="surface-card px-6 py-4 text-sm text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-8">

      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold mb-6 text-[var(--text-primary)]">
        Manage Users
      </h1>

      {/* SEARCH + STATS */}
      <div className="flex justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search users..."
          className="input-field flex-1 max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="surface-card px-6 py-3 text-sm flex items-center gap-2">
          <span className="muted-text">Total Users:</span>
          <span className="font-bold text-[var(--accent-strong)]">
            {filteredUsers.length}
          </span>
        </div>
      </div>

      {/* USER TABLE */}
      <div className="surface-card overflow-auto">

        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)] text-left text-sm muted-text">
              <th className="pb-3 px-4">User</th>
              <th className="px-4">Email</th>
              <th className="px-4">Role</th>
              <th className="px-4">User ID</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user._id}
                className="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)] transition"
              >
                {/* Avatar + Name */}
                <td className="py-4 px-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--accent-strong)] text-white flex items-center justify-center font-bold text-sm">
                    {user.fullName
                      ? user.fullName.charAt(0)
                      : user.email.charAt(0)}
                  </div>

                  <span className="text-[var(--text-primary)]">{user.fullName || "User"}</span>
                </td>

                <td className="px-4 text-[var(--text-primary)]">{user.email}</td>

                {/* ROLE BADGE */}
                <td className="px-4">
                  <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                    {user.role}
                  </span>
                </td>

                <td className="px-4 text-xs muted-text">
                  {user._id}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <p className="text-center py-8 muted-text">
            No users found
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
