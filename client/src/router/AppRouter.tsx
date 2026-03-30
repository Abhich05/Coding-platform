// src/router/AppRouter.tsx
import type { FC } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";

/* Auth */
import SignInPage from "../layouts/auth/SignIn";
import SignUpPage from "../layouts/auth/SignUp";

/* User Dashboard */
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHome from "../pages/Dashboard/index";
import Overview from "../pages/Dashboard/Overview";
import Profile from "../pages/Dashboard/Profile";
import Practise from "../pages/Dashboard/Practise";
import Aptitude from "../pages/Dashboard/Aptitude";
import DSA from "../pages/Dashboard/DSA";
import PracticeTest from "../pages/Dashboard/PracticeTest";
import Jobs from "../pages/Dashboard/Jobs";

/* Recruiter Pages (dev branch) */
import RecruiterDashboard from "../pages/Dashboard";
import RecruiterProblems from "../pages/Problems";
import AssessmentPage from "../pages/Assessment";
import CandidateJoin from "../pages/CandidateJoin";

/* Admin */
import AdminDashboardLayout from "../layouts/AdminDashboardLayout";
import AdminOverview from "../pages/Admin/Overview";
import AdminUsers from "../pages/Admin/Users";
import AdminJobs from "../pages/Admin/Jobs";
import CreateTest from "../pages/Admin/CreateTest";

/* Test Pages */
import TestPage from "../pages/Test/TestPage";
import TestResult from "../pages/Test/TestResult";
import TestResults from "../pages/Admin/Results";


// ⭐ Protected Route Wrapper
const ProtectedRoute: FC<{
  children: React.ReactNode;
  role?: string;
}> = ({ children, role }) => {
  const { user, isAuthenticated, isHydrated } = useUserStore();

  if (!isHydrated) {
    return (
      <div className="app-shell flex items-center justify-center p-6">
        <div className="surface-card px-6 py-4 text-sm muted-text">Loading workspace...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" replace />;
  }

  if (role && user?.role !== role) {
    return user?.role === "admin"
      ? <Navigate to="/admin/overview" replace />
      : user?.role === "recruiter"
        ? <Navigate to="/recruiter/dashboard" replace />
        : <Navigate to="/dashboard/overview" replace />;
  }

  return <>{children}</>;
};


const AppRouter: FC = () => {
  const { user, isAuthenticated, isHydrated } = useUserStore();

  if (!isHydrated) {
    return (
      <div className="app-shell flex items-center justify-center p-6">
        <div className="surface-card px-6 py-4 text-sm muted-text">Loading workspace...</div>
      </div>
    );
  }

  return (
    <Routes>

      {/* ⭐ SMART LANDING */}
      <Route
        path="/"
        element={
          !isAuthenticated
            ? <Navigate to="/auth/signin" replace />
            : user?.role === "admin"
              ? <Navigate to="/admin/overview" replace />
              : user?.role === "recruiter"
                ? <Navigate to="/recruiter/dashboard" replace />
                : <Navigate to="/dashboard/overview" replace />
        }
      />

      {/* ⭐ AUTH */}
      <Route path="/auth/signin" element={<SignInPage />} />
      <Route path="/auth/login" element={<Navigate to="/auth/signin" replace />} />
      <Route path="/auth/signup" element={<SignUpPage />} />


      {/* ⭐ RECRUITER PAGES */}
      <Route
        path="/recruiter/dashboard"
        element={
          <ProtectedRoute role="recruiter">
            <RecruiterDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/problems"
        element={
          <ProtectedRoute role="recruiter">
            <RecruiterProblems />
          </ProtectedRoute>
        }
      />

      {/* ⭐ ASSESSMENT / CODE EDITOR */}
      <Route path="/assessment" element={<AssessmentPage />} />
      <Route path="/candidate/join" element={<CandidateJoin />} />


      {/* ⭐ USER DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
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


      {/* ⭐ ADMIN DASHBOARD */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="overview" element={<AdminOverview />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="jobs" element={<AdminJobs />} />
        <Route path="create-test" element={<CreateTest />} />

        {/* ⭐ NEW ADMIN ANALYTICS */}
        <Route path="test-results" element={<TestResults />} />
      </Route>


      {/* ⭐ STUDENT TEST FLOW */}
      <Route path="/test/:code" element={<TestPage />} />
      <Route path="/test-result" element={<TestResult />} />


      {/* ⭐ 404 */}
      <Route
        path="*"
        element={
          <div className="app-shell flex items-center justify-center p-6">
            <div className="surface-card p-6 text-center">
              <h2 className="text-xl font-semibold">404</h2>
              <p className="muted-text mt-1">The page you’re looking for does not exist.</p>
            </div>
          </div>
        }
      />

    </Routes>
  );
};

export default AppRouter;
