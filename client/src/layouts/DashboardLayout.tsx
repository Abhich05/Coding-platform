// src/layouts/DashboardLayout.tsx
import { useEffect, useState } from "react";
import type { FC, ComponentType } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { ThemeToggle } from "../components/ThemeToggle";

const Icon: Record<string, ComponentType> = {
  Overview: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 13h8V3H3v10zM3 21h8v-6H3v6zM13 21h8V11h-8v10zM13 3v6h8V3h-8z" fill="currentColor" />
    </svg>
  ),
  Practise: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 3v18l15-9L5 3z" fill="currentColor" />
    </svg>
  ),
  Jobs: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 7h18v13a1 1 0 01-1 1H4a1 1 0 01-1-1V7zM8 3h8v4H8V3z" fill="currentColor" />
    </svg>
  ),
  Profile: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 12a5 5 0 100-10 5 5 0 000 10zM4 22a8 8 0 0116 0H4z" fill="currentColor" />
    </svg>
  ),
};

type NavProps = { to: string; label: string; Icon: ComponentType; collapsed: boolean; end?: boolean; onNavigate?: () => void };

const NavItem: FC<NavProps> = ({ to, label, Icon, collapsed, end, onNavigate }) => {
  return (
    <NavLink
      to={to}
      end={end}
      title={label}
      onClick={onNavigate}
      className={({ isActive }) =>
        [
          "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium",
          "transition-all duration-200 ease-out",
          "focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-1",
          isActive
            ? "bg-[var(--accent-strong)] text-[var(--bg-primary)] shadow-md"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] hover:translate-x-1",
          collapsed ? "justify-center" : "justify-start",
        ].join(" ")
      }
    >
      <span className="shrink-0 transition-transform duration-200 group-hover:scale-110 group-active:scale-95" aria-hidden>
        <Icon />
      </span>
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );
};

const DashboardLayout: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/auth/signin", { replace: true });
  };

  // Auto close mobile menu on window resize > md
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="app-shell flex min-h-screen">
      {/* Sidebar - desktop */}
      <aside
        className={`hidden md:flex flex-col shrink-0 transition-all duration-300 ${collapsed ? "w-20" : "w-72"
          } bg-[var(--panel-soft)] border-r border-[var(--border)] backdrop-blur-sm`}
      >
        <div className="px-4 py-4 flex items-center justify-between border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div
              className={`rounded-md ${collapsed ? "w-9 h-9" : "w-12 h-12"
                } bg-[var(--accent-strong)] text-[var(--bg-primary)] flex items-center justify-center font-bold`}
            >
              {collapsed ? "P" : "Plat"}
            </div>

            {!collapsed && (
              <div>
                <div className="text-sm font-semibold">Platform</div>
                <div className="text-xs muted-text">Pro Dashboard</div>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed((s) => !s)}
            className="p-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            aria-pressed={collapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d={collapsed ? "M9 6l6 6-6 6" : "M15 6l-6 6 6 6"}
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
          <NavItem
            to="/dashboard/overview"
            label="Overview"
            Icon={Icon.Overview}
            collapsed={collapsed}
            end
          />
          <NavItem to="/dashboard/practise" label="Practise" Icon={Icon.Practise} collapsed={collapsed} />
          <NavItem to="/dashboard/jobs" label="Jobs" Icon={Icon.Jobs} collapsed={collapsed} />
          <NavItem to="/dashboard/profile" label="Profile" Icon={Icon.Profile} collapsed={collapsed} />
        </nav>

        {/* User + logout in sidebar bottom */}
        <div className="px-3 py-3 border-t border-[var(--border)] flex items-center justify-between">
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--accent-strong)] flex items-center justify-center text-[var(--bg-primary)] font-semibold">
                AR
              </div>
              <div>
                <div className="text-sm">User 1</div>
                <div className="text-xs muted-text">Frontend Dev</div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center flex-1">
              <div className="w-9 h-9 rounded-full bg-[var(--accent-strong)] flex items-center justify-center text-[var(--bg-primary)]">
                AR
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="ml-2 px-2 py-1 rounded-md text-[11px] bg-red-500/90 hover:bg-red-500 text-white"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile header + hamburger */}
      <div className="md:hidden w-full bg-transparent">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-[var(--accent-strong)] text-[var(--bg-primary)] flex items-center justify-center font-bold">
              Plat
            </div>
          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-[var(--panel)] border-r border-[var(--border)] p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-[var(--accent-strong)] text-[var(--bg-primary)] flex items-center justify-center font-bold">
                  Plat
                </div>
                <div>
                  <div className="text-sm font-semibold">Platform</div>
                  <div className="text-xs muted-text">Pro Dashboard</div>
                </div>
              </div>
              <button
                className="p-2 rounded-md hover:bg-white/10"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              <NavItem
                to="/dashboard/overview"
                label="Overview"
                Icon={Icon.Overview}
                collapsed={false}
                onNavigate={() => setMobileOpen(false)}
                end
              />
              <NavItem
                to="/dashboard/practise"
                label="Practise"
                Icon={Icon.Practise}
                collapsed={false}
                onNavigate={() => setMobileOpen(false)}
              />
              <NavItem
                to="/dashboard/jobs"
                label="Jobs"
                Icon={Icon.Jobs}
                collapsed={false}
                onNavigate={() => setMobileOpen(false)}
              />
              <NavItem
                to="/dashboard/profile"
                label="Profile"
                Icon={Icon.Profile}
                collapsed={false}
                onNavigate={() => setMobileOpen(false)}
              />
            </nav>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="surface-panel !rounded-none flex items-center justify-between px-4 md:px-6 py-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-4 min-w-0">
            <h3 className="text-lg font-semibold hidden sm:block shrink-0">Dashboard</h3>

            <div className="relative w-full max-w-xs md:max-w-md">
              <input
                className="w-full rounded-full input-field pr-9"
                placeholder="Search problems, tags, companies..."
                aria-label="Search"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 muted-text" aria-hidden>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 ml-4">
            <span className="text-sm muted-text hidden md:block">Welcome back 👋</span>
            <ThemeToggle />
          </div>
        </header>

        {/* Content area constrained */}
        <main className="flex-1 p-4 md:p-8 bg-transparent flex flex-col">
          <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
            <div className="flex-1">
              <div className="card-glass transition-shadow duration-200 hover:shadow-2xl">
                <Outlet />
              </div>
            </div>
          </div>
        </main>

        <footer className="w-full px-6 py-4 md:px-8 text-xs muted-text flex items-center justify-start border-t border-[var(--border)]">
          <div className="max-w-7xl mx-auto w-full">
            © {new Date().getFullYear()} Platform · Built with ❤️
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
