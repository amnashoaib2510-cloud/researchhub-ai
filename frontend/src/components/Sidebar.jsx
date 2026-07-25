import { NavLink } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuFolderKanban,
  LuFileText,
  LuSparkles,
  LuChartColumn,
  LuBell,
  LuUser,
  LuLogOut,
} from "react-icons/lu";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LuLayoutDashboard, num: "01" },
  { to: "/projects", label: "Projects", icon: LuFolderKanban, num: "02" },
  { to: "/papers", label: "Papers", icon: LuFileText, num: "03" },
  { to: "/ai-tools", label: "AI Tools", icon: LuSparkles, num: "04" },
  { to: "/analytics", label: "Analytics", icon: LuChartColumn, num: "05" },
  { to: "/notifications", label: "Notifications", icon: LuBell, num: "06" },
  { to: "/profile", label: "Profile", icon: LuUser, num: "07" },
];

const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 shrink-0 bg-ink text-parchment min-h-screen flex flex-col">
      <div className="px-6 py-7 border-b border-white/10">
        <p className="eyebrow text-gold-light">Vol. I — Est. 2026</p>
        <h1 className="font-display text-xl font-semibold mt-1 leading-tight">
          ResearchHub <span className="text-gold-light">AI</span>
        </h1>
      </div>

      <nav className="flex-1 py-4">
        {navItems.map(({ to, label, icon: Icon, num }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-sm transition-colors duration-150 border-l-2 ${
                isActive
                  ? "border-gold bg-white/5 text-white"
                  : "border-transparent text-parchment/70 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <span className="font-mono text-[10px] text-gold-light/80 w-4">{num}</span>
            <Icon size={17} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-5 border-t border-white/10">
        <p className="text-sm font-medium truncate">{user?.name}</p>
        <p className="text-xs text-parchment/50 font-mono truncate">{user?.role}</p>
        <button
          onClick={logout}
          className="mt-3 flex items-center gap-2 text-xs text-parchment/60 hover:text-clay-light transition-colors"
        >
          <LuLogOut size={14} /> Sign out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
