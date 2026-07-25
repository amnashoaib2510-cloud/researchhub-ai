import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { LuUserPlus, LuSend } from "react-icons/lu";
import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/Loader";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [newTask, setNewTask] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const loadAll = async () => {
    try {
      const [{ data: proj }, { data: taskList }, { data: msgs }] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks/project/${id}`),
        api.get(`/discussions/${id}`),
      ]);
      setProject(proj);
      setTasks(taskList);
      setMessages(msgs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${id}/invite`, { email: inviteEmail, role: "Collaborator" });
      toast.success("Invitation sent");
      setInviteEmail("");
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not send invite");
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      await api.post("/tasks", { project: id, title: newTask });
      setNewTask("");
      loadAll();
    } catch (err) {
      toast.error("Could not add task");
    }
  };

  const toggleTaskStatus = async (task) => {
    const next = task.status === "Done" ? "To Do" : "Done";
    try {
      await api.put(`/tasks/${task._id}`, { status: next });
      loadAll();
    } catch (err) {
      toast.error("Could not update task");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      const { data } = await api.post("/discussions", { project: id, content: newMessage });
      setMessages((prev) => [...prev, data]);
      setNewMessage("");
    } catch (err) {
      toast.error("Could not send message");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Loader label="Opening project workspace…" />
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout>
        <p className="text-ink-soft">Project not found.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <p className="eyebrow">{project.category || "General"}</p>
      <h1 className="font-display text-3xl font-semibold mt-1 mb-2">{project.title}</h1>
      <p className="text-ink-soft mb-8 max-w-2xl">{project.description}</p>

      <div className="grid grid-cols-3 gap-6">
        {/* Team & Invite */}
        <div className="card">
          <p className="eyebrow mb-1">Team</p>
          <h3 className="font-display text-lg font-semibold mb-4">Members ({project.members.length})</h3>
          <ul className="space-y-2 mb-4">
            {project.members.map((m) => (
              <li key={m.user._id} className="flex justify-between text-sm">
                <span>{m.user.name}</span>
                <span className="text-xs font-mono text-ink-soft">{m.role}</span>
              </li>
            ))}
          </ul>
          <form onSubmit={handleInvite} className="flex gap-2">
            <input
              type="email"
              required
              placeholder="colleague@university.edu"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="input-field text-sm"
            />
            <button type="submit" className="btn-secondary px-3">
              <LuUserPlus size={16} />
            </button>
          </form>
        </div>

        {/* Tasks */}
        <div className="card">
          <p className="eyebrow mb-1">Progress Tracking</p>
          <h3 className="font-display text-lg font-semibold mb-4">Tasks</h3>
          <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
            <input
              placeholder="Add a task…"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="input-field text-sm"
            />
            <button type="submit" className="btn-secondary px-3">+</button>
          </form>
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {tasks.length === 0 && <p className="text-sm text-ink-soft">No tasks yet.</p>}
            {tasks.map((t) => (
              <li key={t._id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={t.status === "Done"}
                  onChange={() => toggleTaskStatus(t)}
                  className="accent-sage"
                />
                <span className={t.status === "Done" ? "line-through text-ink-soft" : ""}>{t.title}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Discussion */}
        <div className="card flex flex-col">
          <p className="eyebrow mb-1">Discussion Panel</p>
          <h3 className="font-display text-lg font-semibold mb-4">Team chat</h3>
          <div className="flex-1 space-y-3 max-h-56 overflow-y-auto mb-3">
            {messages.length === 0 && <p className="text-sm text-ink-soft">No messages yet.</p>}
            {messages.map((m) => (
              <div key={m._id} className="text-sm">
                <span className="font-medium">{m.sender?.name}: </span>
                <span className="text-ink-soft">{m.content}</span>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              placeholder="Write a message…"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="input-field text-sm"
            />
            <button type="submit" className="btn-secondary px-3">
              <LuSend size={16} />
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetail;
