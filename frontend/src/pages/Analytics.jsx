import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/Loader";
import api from "../api/axios";

const STATUS_COLORS = {
  "To Do": "#14213D40",
  "In Progress": "#B8862B",
  Review: "#3D6B52",
  Done: "#A6452F",
};

const Analytics = () => {
  const [dashboard, setDashboard] = useState(null);
  const [productivity, setProductivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: dash }, { data: prod }] = await Promise.all([
          api.get("/analytics/dashboard"),
          api.get("/analytics/productivity"),
        ]);
        setDashboard(dash);
        setProductivity(prod);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <DashboardLayout>
      <p className="eyebrow">Reports</p>
      <h1 className="font-display text-3xl font-semibold mt-1 mb-8">Analytics</h1>

      {loading ? (
        <Loader label="Crunching the numbers…" />
      ) : (
        <div className="grid grid-cols-2 gap-6">
          <div className="card">
            <p className="eyebrow mb-1">Productivity Dashboard</p>
            <h3 className="font-display text-lg font-semibold mb-4">My tasks by status</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={productivity?.tasksByStatus || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#14213D10" />
                <XAxis dataKey="status" tick={{ fontSize: 11, fill: "#14213D" }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#14213D" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 4, border: "1px solid #14213D20", fontSize: 12 }} />
                <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                  {(productivity?.tasksByStatus || []).map((entry, index) => (
                    <Cell key={index} fill={STATUS_COLORS[entry.status] || "#14213D"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <p className="eyebrow mb-1">Collaboration Report</p>
            <h3 className="font-display text-lg font-semibold mb-4">Project status overview</h3>
            <div className="space-y-3">
              {dashboard?.progressChart?.length ? (
                dashboard.progressChart.map((p) => (
                  <div key={p.title} className="flex items-center justify-between border-b border-ink/10 pb-2">
                    <span className="text-sm font-medium">{p.title}</span>
                    <span className="status-pill bg-ink/5 text-ink-soft font-mono">{p.status}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-ink-soft">No project data yet.</p>
              )}
            </div>
          </div>

          <div className="card col-span-2">
            <p className="eyebrow mb-1">Summary</p>
            <h3 className="font-display text-lg font-semibold mb-4">At a glance</h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="font-display text-2xl font-semibold">{dashboard?.stats.totalProjects ?? 0}</p>
                <p className="text-xs font-mono text-ink-soft mt-1">Total Projects</p>
              </div>
              <div>
                <p className="font-display text-2xl font-semibold">{dashboard?.stats.totalPapers ?? 0}</p>
                <p className="text-xs font-mono text-ink-soft mt-1">Papers Uploaded</p>
              </div>
              <div>
                <p className="font-display text-2xl font-semibold">{dashboard?.stats.activeProjects ?? 0}</p>
                <p className="text-xs font-mono text-ink-soft mt-1">Active Projects</p>
              </div>
              <div>
                <p className="font-display text-2xl font-semibold">{dashboard?.stats.openTasks ?? 0}</p>
                <p className="text-xs font-mono text-ink-soft mt-1">Open Tasks</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Analytics;
