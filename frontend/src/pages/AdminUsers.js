import { useEffect, useState } from "react";
import API from "../api/axiosConfig";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const loadUsers = () => {
    setLoading(true);
    setError("");

    const query = roleFilter === "ALL" ? "" : `?role=${encodeURIComponent(roleFilter)}`;

    API.get(`/api/users${query}`)
      .then((res) => {
        setUsers(res.data || []);
      })
      .catch((err) => {
        setError(err?.response?.data?.message || "Failed to load users list.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter]);

  return (
    <div>
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold mb-1">Users & Owners</h2>
          <p className="text-slate-600">Admin view of users, agents, and owners.</p>
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border border-slate-200 rounded-lg p-2.5 bg-white"
        >
          <option value="ALL">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="AGENT">Agent</option>
          <option value="OWNER">Owner</option>
          <option value="USER">User</option>
        </select>
      </div>

      {loading && <div className="p-4">Loading users...</div>}
      {error && <div className="p-4 text-red-600">{error}</div>}

      {!loading && !error && (
        <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Username</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Properties</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-4 text-slate-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-100">
                    <td className="px-4 py-3">{user.fullName || "-"}</td>
                    <td className="px-4 py-3">{user.username || "-"}</td>
                    <td className="px-4 py-3">{user.role || "-"}</td>
                    <td className="px-4 py-3">{user.phone || "-"}</td>
                    <td className="px-4 py-3">{user.email || "-"}</td>
                    <td className="px-4 py-3">{user.propertyCount ?? 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

