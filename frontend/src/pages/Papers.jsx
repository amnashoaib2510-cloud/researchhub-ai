import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LuUpload, LuDownload, LuSparkles, LuSearch, LuX } from "react-icons/lu";
import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/Loader";
import api from "../api/axios";

const Papers = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [summarizingId, setSummarizingId] = useState(null);
  const [form, setForm] = useState({ title: "", authors: "", category: "", abstract: "" });
  const [file, setFile] = useState(null);

  const fetchPapers = async (q = "") => {
    setLoading(true);
    try {
      const { data } = await api.get("/papers", { params: q ? { search: q } : {} });
      setPapers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPapers(search);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please attach a file");
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("file", file);
      await api.post("/papers", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Paper uploaded");
      setShowForm(false);
      setForm({ title: "", authors: "", category: "", abstract: "" });
      setFile(null);
      fetchPapers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setSaving(false);
    }
  };

  const handleSummarize = async (paperId) => {
    setSummarizingId(paperId);
    try {
      const { data } = await api.post(`/papers/${paperId}/summarize`);
      setPapers((prev) =>
        prev.map((p) => (p._id === paperId ? { ...p, aiSummary: data.aiSummary } : p))
      );
      toast.success("AI summary generated");
    } catch (err) {
      toast.error("Could not generate summary");
    } finally {
      setSummarizingId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="eyebrow">Document Management</p>
          <h1 className="font-display text-3xl font-semibold mt-1">Research Papers</h1>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <LuUpload size={16} /> Upload paper
        </button>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6 max-w-md">
        <input
          className="input-field text-sm"
          placeholder="Search by title, abstract, or keyword…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn-secondary px-3">
          <LuSearch size={16} />
        </button>
      </form>

      {showForm && (
        <div className="card mb-8 relative">
          <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-ink-soft hover:text-clay">
            <LuX size={18} />
          </button>
          <h3 className="font-display text-lg font-semibold mb-4">Upload a research paper</h3>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="label">Title</label>
              <input required className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Authors (comma-separated)</label>
                <input className="input-field" value={form.authors} onChange={(e) => setForm({ ...form, authors: e.target.value })} placeholder="A. Khan, B. Ahmed" />
              </div>
              <div>
                <label className="label">Category</label>
                <input className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. NLP" />
              </div>
            </div>
            <div>
              <label className="label">Abstract</label>
              <textarea rows={3} className="input-field" value={form.abstract} onChange={(e) => setForm({ ...form, abstract: e.target.value })} />
            </div>
            <div>
              <label className="label">File (PDF, DOC, DOCX, TXT)</label>
              <input type="file" required accept=".pdf,.doc,.docx,.txt" onChange={(e) => setFile(e.target.files[0])} className="text-sm" />
            </div>
            <button type="submit" disabled={saving} className="btn-gold">
              {saving ? "Uploading…" : "Upload"}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <Loader label="Fetching your library…" />
      ) : papers.length === 0 ? (
        <div className="card text-center py-14">
          <p className="text-ink-soft">No papers found. Upload your first paper above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {papers.map((p) => (
            <div key={p._id} className="card">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <p className="eyebrow mb-1">{p.category || "Uncategorized"}</p>
                  <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                  {p.authors?.length > 0 && (
                    <p className="text-xs text-ink-soft font-mono mt-1">{p.authors.join(", ")}</p>
                  )}
                  {p.abstract && <p className="text-sm text-ink-soft mt-2 line-clamp-2">{p.abstract}</p>}
                  {p.keywords?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {p.keywords.map((k) => (
                        <span key={k} className="text-[11px] font-mono bg-ink/5 px-2 py-0.5 rounded-full text-ink-soft">
                          {k}
                        </span>
                      ))}
                    </div>
                  )}
                  {p.aiSummary && (
                    <div className="mt-3 border-l-2 border-gold pl-3">
                      <p className="text-xs font-mono text-gold-dark mb-1">AI Summary</p>
                      <p className="text-sm text-ink-soft">{p.aiSummary}</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <a href={p.fileUrl} target="_blank" rel="noreferrer" className="btn-secondary text-xs px-3 py-2">
                    <LuDownload size={14} /> Download
                  </a>
                  <button
                    onClick={() => handleSummarize(p._id)}
                    disabled={summarizingId === p._id}
                    className="btn-secondary text-xs px-3 py-2"
                  >
                    <LuSparkles size={14} /> {summarizingId === p._id ? "Summarizing…" : "AI Summary"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Papers;
