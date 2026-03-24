// src/layouts/DashboardLayout.tsx
import { useEffect, useState } from "react";
import type { FC, ComponentType } from "react";
import { NavLink, Outlet } from "react-router-dom";

/* Inline icons (kept minimal) */
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

type NavProps = { to: string; label: string; Icon: ComponentType; collapsed: boolean; end?: boolean };

const NavItem: FC<NavProps> = ({ to, label, Icon, collapsed, end }) => {
  return (
    <NavLink
      to={to}
      end={end}
      title={label}
      className={({ isActive }) =>
        [
          "group flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200",
          isActive
            ? "bg-gradient-to-r from-indigo-600 to-cyan-500 text-black shadow-2xl"
            : "text-gray-300 hover:bg-white/5 hover:text-white",
          collapsed ? "justify-center" : "justify-start",
          "focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2",
        ].join(" ")
      }
    >
      <span
        className="text-inherit shrink-0"
        aria-hidden
      >
        <Icon />
      </span>
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );
};

const DashboardLayout: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auto close mobile menu on window resize > md
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    // top-level dark background
    <div className="flex min-h-screen text-gray-100 bg-[#07102a]">
      {/* Sidebar - desktop */}
      <aside
        className={`hidden md:flex flex-col shrink-0 transition-all duration-300 ${collapsed ? "w-20" : "w-72"
          } bg-[rgba(6,10,20,0.6)] border-r border-white/6`}
      >
        <div className="px-4 py-4 flex items-center justify-between border-b border-white/6">
          <div className="flex items-center gap-3">
            <div
              className={`rounded-md ${collapsed ? "w-9 h-9" : "w-12 h-12"} bg-gradient-to-br from-indigo-600 to-cyan-400 text-black flex items-center justify-center font-bold`}
            >
              {collapsed ? "P" : "Plat"}
            </div>

            {!collapsed && (
              <div>
                <div className="text-sm font-semibold">Platform</div>
                <div className="text-xs text-gray-400">Pro Dashboard</div>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed((s) => !s)}
            className="p-2 rounded-md hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-400"
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
          {/* pass 'end' for exact active match on Overview */}
          <NavItem to="/dashboard/overview" label="Overview" Icon={Icon.Overview} collapsed={collapsed} end />
          <NavItem to="/dashboard/practise" label="Practise" Icon={Icon.Practise} collapsed={collapsed} />
          <NavItem to="/dashboard/jobs" label="Jobs" Icon={Icon.Jobs} collapsed={collapsed} />
          <NavItem to="/dashboard/profile" label="Profile" Icon={Icon.Profile} collapsed={collapsed} />
        </nav>

        <div className="px-3 py-3 border-t border-white/6">
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-black font-semibold">AR</div>
              <div>
                <div className="text-sm">User 1</div>
                <div className="text-xs text-gray-400">Frontend Dev</div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-black">AR</div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile header + hamburger */}
      <div className="md:hidden w-full bg-transparent">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-gradient-to-br from-indigo-600 to-cyan-400 text-black flex items-center justify-center font-bold">Plat</div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-md hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-[rgba(6,10,20,0.95)] border-r border-white/6 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-gradient-to-br from-indigo-600 to-cyan-400 text-black flex items-center justify-center font-bold">Plat</div>
                <div>
                  <div className="text-sm font-semibold">Platform</div>
                  <div className="text-xs text-gray-400">Pro Dashboard</div>
                </div>
              </div>
              <button className="p-2 rounded-md hover:bg-white/5" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                ✕
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              <NavItem to="/dashboard/overview" label="Overview" Icon={Icon.Overview} collapsed={false} end />
              <NavItem to="/dashboard/practise" label="Practise" Icon={Icon.Practise} collapsed={false} />
              <NavItem to="/dashboard/jobs" label="Jobs" Icon={Icon.Jobs} collapsed={false} />
              <NavItem to="/dashboard/profile" label="Profile" Icon={Icon.Profile} collapsed={false} />
            </nav>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-white/6 bg-[linear-gradient(90deg,rgba(255,255,255,0.01),transparent)]">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold">Dashboard</h3>

            <div className="relative">
              <input
                className="w-64 md:w-96 rounded-full bg-white/6 px-4 py-2 text-sm placeholder:text-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
                placeholder="Search problems, tags, companies..."
                aria-label="Search"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" aria-hidden>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </header>

        {/* Content area constrained */}
        <main className="flex-1 p-6 md:p-8 bg-transparent text-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="text-xs text-gray-400 mb-4"></div>

            <div className="min-h-[60vh]">
              <div className="card-glass transition-shadow duration-200 hover:shadow-2xl">
                <Outlet />
              </div>
            </div>

            {/* sticky-ish footer: push to bottom visually when content short */}
            <footer className="mt-8 text-xs text-gray-500 flex items-center justify-start">
              <div>© {new Date().getFullYear()} Platform · Built with ❤️</div>
            </footer>
          </div>
        </main>
      </div>
    </div> 
  );
};
export default DashboardLayout;
