"use client";

import { useState, useEffect, useCallback } from "react";

interface UserRow {
  id?: string; _id?: string;
  name?: string; email?: string; role?: string;
  createdAt?: string;
}

const inputCls = "w-full bg-[#0A1628] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#D4AF37] outline-none";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("Name, email, and password are required.");
      return;
    }
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setModal(false);
        setForm({ name: "", email: "", password: "" });
        await load();
      } else {
        setError(data.message || "Failed to create user");
      }
    } catch (e) { console.error(e); setError("Failed to create user"); }
    setSaving(false);
  };

  const del = async (id: string) => {
    if (!confirm("Delete this user? They will no longer be able to log in.")) return;
    try {
      await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
      await load();
    } catch (e) { console.error(e); }
  };

  if (loading) return <div className="min-h-screen bg-[#0A1628] flex items-center justify-center"><div className="text-white/60 text-lg">Loading users...</div></div>;

  return (
    <div className="min-h-screen bg-[#0A1628] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-light text-white">Manage Users ({users.length})</h1>
          <button onClick={() => { setForm({ name: "", email: "", password: "" }); setError(""); setModal(true); }}
            className="bg-[#D4AF37] text-[#0A1628] px-5 py-2 rounded-lg font-medium hover:bg-[#C4A030] transition">
            + Add New User
          </button>
        </div>

        <p className="text-white/40 text-sm mb-6">Create admin accounts so your team can log in at <span className="text-[#D4AF37]">/auth/login</span>. Passwords are stored hashed — never in plaintext.</p>

        {users.length === 0 ? (
          <div className="text-white/40 text-center py-16 text-lg">No users yet. Click "+ Add New User" to create the first admin account.</div>
        ) : (
          <div className="bg-[#0F1E35] border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-[#0A1628]">
                <tr className="text-white/40 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Created</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id || u._id} className="border-t border-white/5 hover:bg-white/5 transition">
                    <td className="px-5 py-3 text-white font-medium">{u.name || "—"}</td>
                    <td className="px-5 py-3 text-white/60 text-sm">{u.email}</td>
                    <td className="px-5 py-3">
                      <span className="text-[10px] uppercase tracking-wider bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 rounded-full px-2 py-0.5">
                        {u.role || "admin"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-white/40 text-xs">{u.createdAt ? new Date(u.createdAt).toLocaleString() : "—"}</td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => del(u.id || u._id || "")}
                        className="text-red-400/70 hover:text-red-400 text-sm px-3 py-1 border border-red-400/20 rounded hover:border-red-400 transition">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0F1E35] border border-white/20 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl text-white font-semibold mb-4">Add New User</h2>
            <div className="space-y-3">
              <div>
                <label className="text-white/60 text-xs block mb-1">Full Name</label>
                <input className={inputCls} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Su Myat" />
              </div>
              <div>
                <label className="text-white/60 text-xs block mb-1">Email</label>
                <input className={inputCls} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="name@a9globaltravel.com.mm" />
              </div>
              <div>
                <label className="text-white/60 text-xs block mb-1">Password (min 6 characters)</label>
                <input className={inputCls} type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
              </div>
              {error && <p className="text-red-400 text-xs">{error}</p>}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal(false)} className="flex-1 border border-white/20 text-white/70 py-2.5 rounded-lg hover:bg-white/5 transition">Cancel</button>
              <button onClick={save} disabled={saving}
                className="flex-1 bg-[#D4AF37] text-[#0A1628] py-2.5 rounded-lg font-medium hover:bg-[#C4A030] transition disabled:opacity-50">
                {saving ? "Creating..." : "Create User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
