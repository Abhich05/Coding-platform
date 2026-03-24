// src/router/AppRouter.tsx
import type { FC } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import SignInPage from '../layouts/auth/SignIn';
import SignUpPage from '../layouts/auth/SignUp';

import DashboardLayout from '../layouts/DashboardLayout';
import DashboardHome from '../pages/Dashboard';
import Overview from '../pages/Dashboard/Overview';
import Profile from '../pages/Dashboard/Profile';
import Practise from '../pages/Dashboard/Practise';
import Jobs from '../pages/Dashboard/Jobs';

const AppRouter: FC = () => {
  return (
    <Routes>
      {/* Landing redirect – choose where to start */}
      <Route path="/" element={<Navigate to="/auth/signin" replace />} />

      {/* Auth pages – full screen, no DashboardLayout */}
      <Route
        path="/auth/signin"
        element={<SignInPage isOpen={true} onClose={() => {}} />}
      />
      <Route
        path="/auth/signup"
        element={<SignUpPage />}
      />

      {/* Dashboard routes – with sidebar layout */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        {/* index route will render DashboardHome which redirects to /dashboard/overview if you coded that */}
        <Route index element={<DashboardHome />} />
        <Route path="overview" element={<Overview />} />
        <Route path="profile" element={<Profile />} />
        {/* Use simple 'practise' unless Practise has nested routes */}
        <Route path="practise" element={<Practise />} />
        <Route path="jobs" element={<Jobs />} />
      </Route>

      {/* Fallback */}
      <Route
        path="*"
        element={<div style={{ padding: 24 }}>404 - Not Found</div>}
      />
    </Routes>
  );
};

export default AppRouter;
