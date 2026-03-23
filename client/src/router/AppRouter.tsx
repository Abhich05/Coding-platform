// src/router/AppRouter.tsx
import type { FC } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHome from "../pages/Dashboard";
import Overview from "../pages/Dashboard/Overview";
import Profile from "../pages/Dashboard/Profile";
import Practise from "../pages/Dashboard/Practise";
import Jobs from "../pages/Dashboard/Jobs";

const AppRouter: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/dashboard" element={<DashboardLayout />}>
        {/* index route will render DashboardHome which redirects to /dashboard/overview */}
        <Route index element={<DashboardHome />} />
        <Route path="overview" element={<Overview />} />
        <Route path="profile" element={<Profile />} />
        {/* Use simple 'practise' unless Practise contains its own nested Routes */}
        <Route path="practise" element={<Practise />} />
        <Route path="jobs" element={<Jobs />} />
      </Route>

      <Route path="*" element={<div style={{ padding: 24 }}>404 - Not Found</div>} />
    </Routes>
  );
};

export default AppRouter;
