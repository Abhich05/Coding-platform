import { useState, useEffect } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";

/* ─── Sidebar link ─────────────────────────────────────────── */
interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  collapsed: boolean;
  onNavigate?: () => void;
}

const SidebarLink = ({ to, icon, children, collapsed, onNavigate }: SidebarLinkProps) => (
  <NavLink
    to={to}
    title={collapsed ? String(children) : undefined}
    onClick={onNavigate}
    className={({ isActive }) =>
      `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 select-none
      ${collapsed ? "justify-center" : ""}
      ${isActive
        ? "bg-[var(--accent-strong)] text-[var(--bg-primary)] shadow-md"
        : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] hover:translate-x-1"
      }`
    }
  >
    <span className="transition-transform duration-200 group-hover:scale-110 group-active:scale-95 shrink-0">
      {icon}
    </span>
    {!collapsed && (
      <span className="text-sm font-medium truncate">{children}</span>
    )}
  </NavLink>
);

/* ─── Sidebar content ──────────────────────────────────────── */
interface SidebarContentProps {
  collapsed: boolean;
  navLinks: Array<{ to: string; icon: React.ReactNode; label: string }>;
  onNavigate?: () => void;
  onToggleCollapse: () => void;
}

const SidebarContent = ({
  collapsed,
  navLinks,
  onNavigate,
  onToggleCollapse,
}: SidebarContentProps) => (
  <>
    {/* Sidebar header */}
    <div
      className={`flex items-center border-b border-[var(--border)] px-4 py-4 ${collapsed ? "justify-center" : "justify-between"
        }`}
    >
      {!collapsed && (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-[var(--accent-strong)] text-[var(--bg-primary)] flex items-center justify-center text-xs font-bold shrink-0">
            Adm
          </div>
          <span className="font-bold text-base truncate">Admin Panel</span>
        </div>
      )}
      <button
        className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text-secondary)] shrink-0"
        onClick={onToggleCollapse}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </div>

    {/* Nav */}
    <nav className="flex flex-col gap-1.5 p-3 flex-1">
      {navLinks.map((link) => (
        <SidebarLink
          key={link.to}
          to={link.to}
          icon={link.icon}
          collapsed={collapsed}
          onNavigate={onNavigate}
        >
          {link.label}
        </SidebarLink>
      ))}
    </nav>
  </>
);

/* ─── Layout ────────────────────────────────────────────────── */
const AdminDashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const navLinks = [
    { to: "/admin/overview", icon: <LayoutDashboard size={18} />, label: "Overview" },
    { to: "/admin/users", icon: <Users size={18} />, label: "Users" },
    { to: "/admin/create-test", icon: <FileText size={18} />, label: "Test Creation" },
    { to: "/admin/test-results", icon: <ClipboardList size={18} />, label: "Results" },
    { to: "/admin/jobs", icon: <Briefcase size={18} />, label: "Jobs" },
  ];

  return (
    <div className="app-shell flex min-h-screen">

      {/* ── Desktop sidebar ── */}
      <aside
        className={`hidden md:flex flex-col bg-[var(--panel-soft)] border-r border-[var(--border)] shadow-xl transition-all duration-300 ${collapsed ? "w-16" : "w-64"
          }`}
      >
        <SidebarContent
          collapsed={collapsed}
          navLinks={navLinks}
          onToggleCollapse={() => setCollapsed((c) => !c)}
        />
      </aside>

      {/* ── Mobile drawer overlay ── */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-[var(--panel-soft)] border-r border-[var(--border)] flex flex-col">
            {/* Mobile close button in header row */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-[var(--accent-strong)] text-[var(--bg-primary)] flex items-center justify-center text-xs font-bold">
                  Adm
                </div>
                <span className="font-bold text-base">Admin Panel</span>
              </div>
              <button
                className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>
            <nav className="flex flex-col gap-1.5 p-3">
              {navLinks.map((link) => (
                <SidebarLink
                  key={link.to}
                  to={link.to}
                  icon={link.icon}
                  collapsed={false}
                  onNavigate={() => setMobileOpen(false)}
                >
                  {link.label}
                </SidebarLink>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">

        {/* Topbar */}
        <header className="surface-panel !rounded-none flex items-center justify-between px-4 md:px-6 py-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            {/* Hamburger (mobile only) */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-semibold">Welcome, Admin</h1>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <div className="card-glass">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

export default AdminDashboardLayout;
