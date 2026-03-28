// src/router/AppRouter.tsx
import type { FC } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUserStore } from '../store/useUserStore';

import SignInPage from '../layouts/auth/SignIn';
import SignUpPage from '../layouts/auth/SignUp';

import DashboardLayout from '../layouts/DashboardLayout';
import DashboardHome from '../pages/Dashboard';
import Overview from '../pages/Dashboard/Overview';
import Profile from '../pages/Dashboard/Profile';
import Practise from '../pages/Dashboard/Practise';
import Aptitude from '../pages/Dashboard/Aptitude';
import DSA from '../pages/Dashboard/DSA';
import PracticeTest from '../pages/Dashboard/PracticeTest';
import Jobs from '../pages/Dashboard/Jobs';

// Protected Route Component
const ProtectedRoute: FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const isHydrated = useUserStore((state) => state.isHydrated);
  
  // Show loading while store is hydrating
  if (!isHydrated) {
    return <div>Verifying access...</div>;
  }
  
  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to signin');
    return <Navigate to="/auth/signin" replace />;
  }
  
  return <>{children}</>;
};

const AppRouter: FC = () => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const isHydrated = useUserStore((state) => state.isHydrated);
  const setUser = useUserStore((state) => state.setUser);

  // Still helpful to have an initialization effect if we need to sync manually
  // but with Zustand persist and isHydrated, it's less critical.
  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      const storedData = localStorage.getItem('user-storage');
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          const userData = parsed.state?.user || parsed.user;
          if (userData && userData.id && userData.email) {
            console.log('Syncing user from localStorage on mount:', userData);
            setUser(userData);
          }
        } catch (e) {
          console.error('Error syncing auth state:', e);
        }
      }
    }
  }, [isHydrated, isAuthenticated, setUser]);

  if (!isHydrated) {
    return <div>Loading...</div>;
  }

  console.log('AppRouter render - isAuthenticated:', isAuthenticated);

  return (
    <Routes>
      {/* Landing redirect – choose where to start */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard/overview" replace /> : <Navigate to="/auth/signin" replace />} />

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
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* index route will render DashboardHome which redirects to /dashboard/overview if you coded that */}
        <Route index element={<DashboardHome />} />
        <Route path="overview" element={<Overview />} />
        <Route path="profile" element={<Profile />} />
        <Route path="practise">
          <Route index element={<Practise />} />
          <Route path="aptitude" element={<Aptitude />} />
          <Route path="dsa" element={<DSA />} />
          <Route path="test" element={<PracticeTest />} />
        </Route>
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
