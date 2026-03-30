import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white">
        <div className="p-4 font-bold text-lg">Admin Panel</div>
        <nav className="mt-4 space-y-2">
          <Link to="/admin" className="block px-4 py-2 hover:bg-slate-800">
            Dashboard
          </Link>
          {/* Future admin links */}
          {/* <Link to="/admin/users" ...>Users</Link> */}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-slate-50 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
