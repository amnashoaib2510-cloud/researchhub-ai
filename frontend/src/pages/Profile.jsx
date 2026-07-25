import { useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Profile = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    institution: user?.institution || "",
    bio: user?.bio || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put("/users/profile", form);
      const stored = JSON.parse(localStorage.getItem("researchhub_user"));
      localStorage.setItem("researchhub_user", JSON.stringify({ ...stored, ...data }));
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <p className="eyebrow">Account</p>
      <h1 className="font-display text-3xl font-semibold mt-1 mb-8">Profile</h1>

      <div className="card max-w-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-ink text-parchment flex items-center justify-center font-display text-xl">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <p className="font-medium">{user?.name}</p>
            <p className="text-xs font-mono text-ink-soft">{user?.email} · {user?.role}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Full name</label>
            <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Institution</label>
            <input className="input-field" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} placeholder="e.g. NED University of Engineering & Technology" />
          </div>
          <div>
            <label className="label">Bio</label>
            <textarea rows={3} className="input-field" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="A short line about your research interests" />
          </div>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Saving…" : "Save changes"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
