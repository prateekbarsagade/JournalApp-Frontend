import { useEffect, useState } from "react";
import { getAllUsersAdmin, createAdmin } from "../api/api";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [listError, setListError] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const loadUsers = async () => {
    setLoadingUsers(true);
    setListError("");
    try {
      const res = await getAllUsersAdmin();
      setUsers(res.data);
    } catch (err) {
      setListError(
        err.response?.status === 403
          ? "You don't have admin access."
          : "Could not load users."
      );
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMsg("");

    if (!username.trim() || !password.trim()) {
      setFormError("Both username and password are required.");
      return;
    }

    setSaving(true);
    try {
      await createAdmin(username, password);
      setSuccessMsg(`Admin "${username}" created.`);
      setUsername("");
      setPassword("");
      loadUsers();
    } catch (err) {
      setFormError(
        err.response?.status === 403
          ? "You don't have admin access."
          : "Could not create admin."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-xl font-semibold text-gray-800 mb-6">Admin panel</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
      >
        <h2 className="text-lg font-medium text-gray-800 mb-4">
          Create a new admin
        </h2>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {formError && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
            {formError}
          </p>
        )}
        {successMsg && (
          <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-4">
            {successMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-4 py-2 rounded-lg transition"
        >
          {saving ? "Creating..." : "Create admin"}
        </button>
      </form>

      <h2 className="text-lg font-medium text-gray-800 mb-4">All users</h2>
      {loadingUsers ? (
        <p className="text-gray-500">Loading users...</p>
      ) : listError ? (
        <p className="text-sm text-red-600">{listError}</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y">
          {users.map((u, idx) => (
            <div key={u.id || idx} className="px-5 py-3 flex justify-between">
              <span className="text-gray-800">{u.username}</span>
              <span className="text-xs text-gray-400">
                {Array.isArray(u.roles) ? u.roles.join(", ") : ""}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
