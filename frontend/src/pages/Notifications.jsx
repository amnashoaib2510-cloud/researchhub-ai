import { useEffect, useState } from "react";
import { LuBellRing, LuCheck } from "react-icons/lu";
import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/Loader";
import api from "../api/axios";

const typeLabels = {
  PROJECT_INVITATION: "Invitation",
  TASK_ASSIGNED: "Task",
  DEADLINE_REMINDER: "Deadline",
  RESEARCH_UPDATE: "Update",
  PAPER_UPLOADED: "Paper",
  GENERAL: "General",
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get("/notifications");
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      await api.put("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="eyebrow">Inbox</p>
          <h1 className="font-display text-3xl font-semibold mt-1">Notifications</h1>
        </div>
        <button onClick={markAllRead} className="btn-secondary text-sm">
          <LuCheck size={14} /> Mark all as read
        </button>
      </div>

      {loading ? (
        <Loader label="Checking your inbox…" />
      ) : notifications.length === 0 ? (
        <div className="card text-center py-14">
          <LuBellRing className="mx-auto mb-3 text-ink/20" size={28} />
          <p className="text-ink-soft">You're all caught up.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`card flex items-start justify-between gap-4 ${!n.isRead ? "border-l-2 border-l-gold" : ""}`}
            >
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-gold-dark">
                  {typeLabels[n.type] || "General"}
                </span>
                <h4 className="font-medium mt-1">{n.title}</h4>
                <p className="text-sm text-ink-soft mt-0.5">{n.message}</p>
                <p className="text-xs text-ink-soft/70 font-mono mt-1.5">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
              {!n.isRead && (
                <button onClick={() => markRead(n._id)} className="text-xs text-gold-dark hover:underline shrink-0">
                  Mark read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Notifications;
