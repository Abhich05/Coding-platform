import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Briefcase, FileText } from "lucide-react";

const AdminDashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#02043A] text-white">

      {/* Sidebar */}
      <aside className="w-64 bg-[#01022B] shadow-xl flex flex-col">

        <div className="p-6 text-2xl font-bold border-b border-white/10">
          Admin Panel
        </div>

        <nav className="flex flex-col gap-2 p-4">

          <SidebarLink to="/admin/overview" icon={<LayoutDashboard size={18} />}>
            Overview
          </SidebarLink>

          <SidebarLink to="/admin/users" icon={<Users size={18} />}>
            Users
          </SidebarLink>

          <SidebarLink to="/admin/create-test" icon={<FileText size={18} />}>
            Test Creation
          </SidebarLink>
          <SidebarLink to="/admin/results" icon={<Users size={18} />}>
  Results
</SidebarLink>


          <SidebarLink to="/admin/jobs" icon={<Briefcase size={18} />}>
            Jobs
          </SidebarLink>

        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        <header className="h-16 flex items-center justify-between px-6 border-b border-white/10 bg-[#01022B]">
          <h1 className="text-lg font-semibold">
            Admin Dashboard
          </h1>

          <div className="text-sm opacity-80">
            Welcome Admin 👋
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

const SidebarLink = ({ to, icon, children }: any) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-xl transition
      ${
        isActive
          ? "bg-orange-500 text-white shadow-md"
          : "hover:bg-white/10 text-white/80"
      }`
    }
  >
    {icon}
    {children}
  </NavLink>
);

export default AdminDashboardLayout;
