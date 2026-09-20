import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getAllEntries,
  createEntry,
  updateEntry,
  deleteEntry,
} from "../api/api";

export default function JournalPage() {
  const { user, logout } = useAuth();

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // form state (shared between "create" and "edit" mode)
  const [editingId, setEditingId] = useState(null); // null = create mode
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const loadEntries = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllEntries();
      setEntries(res.data);
    } catch (err) {
      setError("Could not load journal entries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
  };

  const startEdit = (entry) => {
    setEditingId(entry.id);
    setTitle(entry.title || "");
    setContent(entry.content || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) {
      setError("Please add a title or content before saving.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        await updateEntry(editingId, { title, content });
      } else {
        await createEntry({ title, content });
      }
      resetForm();
      await loadEntries();
    } catch (err) {
      setError("Could not save entry.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry? This can't be undone.")) return;
    try {
      await deleteEntry(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
      if (editingId === id) resetForm();
    } catch (err) {
      setError("Could not delete entry.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">My Journal</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Create / Edit form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
        >
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            {editingId ? "Edit entry" : "New entry"}
          </h2>

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Write your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
              {error}
            </p>
          )} */}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-4 py-2 rounded-lg transition"
            >
              {saving ? "Saving..." : editingId ? "Update entry" : "Add entry"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-gray-600 hover:text-gray-800 px-4 py-2"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Entries list */}
        {loading ? (
          <p className="text-gray-500 text-center">Loading entries...</p>
        ) : entries.length === 0 ? (
          <p className="text-gray-500 text-center">
            No journal entries yet. Write your first one above.
          </p>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {entry.title || "(Untitled)"}
                    </h3>
                    {entry.date && (
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(entry.date).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-3 shrink-0">
                    <button
                      onClick={() => startEdit(entry)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 mt-2 whitespace-pre-wrap">
                  {entry.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
