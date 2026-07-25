import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LuPlus, LuX } from "react-icons/lu";
import toast from "react-hot-toast";
import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/Loader";
import api from "../api/axios";

const statusColors = {
  Planning: "bg-ink/10 text-ink",
  Active: "bg-sage/15 text-sage",
  Completed: "bg-gold/15 text-gold-dark",
  "On Hold": "bg-clay/15 text-clay",
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "", deadline: "" });
  const [saving, setSaving] = useState(false);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get("/projects");
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/projects", form);
      toast.success("Project created");
      setShowForm(false);
      setForm({ title: "", description: "", category: "", deadline: "" });
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not create project");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="eyebrow">Research Collaboration</p>
          <h1 className="font-display text-3xl font-semibold mt-1">Projects</h1>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <LuPlus size={16} /> New project
        </button>
      </div>

      {showForm && (
        <div className="card mb-8 relative">
          <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-ink-soft hover:text-clay">
            <LuX size={18} />
          </button>
          <h3 className="font-display text-lg font-semibold mb-4">Start a new project</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="label">Title</label>
              <input required className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Machine Learning for Crop Yield Prediction" />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea required rows={3} className="input-field" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What is this research about?" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Category</label>
                <input className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Computer Science" />
              </div>
              <div>
                <label className="label">Deadline</label>
                <input type="date" className="input-field" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
              </div>
            </div>
            <button type="submit" disabled={saving} className="btn-gold">
              {saving ? "Creating…" : "Create project"}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <Loader label="Gathering your projects…" />
      ) : projects.length === 0 ? (
        <div className="card text-center py-14">
          <p className="text-ink-soft">No projects yet. Start your first research project above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5">
          {projects.map((p) => (
            <Link to={`/projects/${p._id}`} key={p._id} className="card hover:border-gold/50 transition-colors block">
              <div className="flex items-center justify-between mb-2">
                <span className={`status-pill ${statusColors[p.status] || "bg-ink/10 text-ink"}`}>{p.status}</span>
                <span className="font-mono text-xs text-ink-soft">{p.progress}%</span>
              </div>
              <h3 className="font-display text-lg font-semibold mb-1">{p.title}</h3>
              <p className="text-sm text-ink-soft line-clamp-2 mb-3">{p.description}</p>
              <div className="flex items-center justify-between text-xs text-ink-soft font-mono">
                <span>{p.category || "General"}</span>
                <span>{p.members?.length || 0} member(s)</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Projects;
