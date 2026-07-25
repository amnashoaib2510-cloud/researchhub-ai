import { useEffect, useState } from "react";
import { LuFolderKanban, LuCircleCheck, LuFileText, LuListTodo } from "react-icons/lu";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/StatCard";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await api.get("/analytics/dashboard");
        setData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <DashboardLayout>
      <p className="eyebrow">Dashboard</p>
      <h1 className="font-display text-3xl font-semibold mt-1 mb-8">
        Welcome back, {user?.name?.split(" ")[0]}
      </h1>

      {loading ? (
        <Loader label="Compiling your research summary…" />
      ) : (
        <>
          <div className="grid grid-cols-4 gap-5 mb-8">
            <StatCard num="01" label="Active Projects" value={data?.stats.activeProjects ?? 0} icon={LuFolderKanban} />
            <StatCard num="02" label="Completed" value={data?.stats.completedProjects ?? 0} icon={LuCircleCheck} />
            <StatCard num="03" label="Papers Uploaded" value={data?.stats.totalPapers ?? 0} icon={LuFileText} />
            <StatCard num="04" label="Open Tasks" value={data?.stats.openTasks ?? 0} icon={LuListTodo} />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="card col-span-2">
              <p className="eyebrow mb-1">Monthly Upload Statistics</p>
              <h3 className="font-display text-lg font-semibold mb-4">Papers uploaded, last 6 months</h3>
              <ResponsiveContainer width="100%" height={230}>
                <AreaChart data={data?.monthlyUploads || []}>
                  <defs>
                    <linearGradient id="uploadGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#B8862B" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#B8862B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#14213D10" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#14213D" }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#14213D" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 4, border: "1px solid #14213D20", fontSize: 12 }} />
                  <Area type="monotone" dataKey="uploads" stroke="#B8862B" fill="url(#uploadGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <p className="eyebrow mb-1">Recent Uploads</p>
              <h3 className="font-display text-lg font-semibold mb-4">Latest papers</h3>
              <ul className="space-y-3">
                {data?.recentPapers?.length ? (
                  data.recentPapers.map((p) => (
                    <li key={p._id} className="border-b border-ink/10 pb-2 last:border-0">
                      <p className="text-sm font-medium truncate">{p.title}</p>
                      <p className="text-xs text-ink-soft font-mono">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </p>
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-ink-soft">No papers uploaded yet.</p>
                )}
              </ul>
            </div>
          </div>

          <div className="card mt-6">
            <p className="eyebrow mb-1">Research Progress</p>
            <h3 className="font-display text-lg font-semibold mb-4">Project completion</h3>
            <div className="space-y-4">
              {data?.progressChart?.length ? (
                data.progressChart.map((p) => (
                  <div key={p.title}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{p.title}</span>
                      <span className="font-mono text-ink-soft">{p.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-ink/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sage rounded-full transition-all duration-500"
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-ink-soft">No projects yet — create one to see progress here.</p>
              )}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
