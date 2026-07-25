import Sidebar from "../components/Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-parchment bg-paper-grain" style={{ backgroundSize: "18px 18px" }}>
      <Sidebar />
      <main className="flex-1 px-10 py-8 max-w-6xl">{children}</main>
    </div>
  );
};

export default DashboardLayout;
