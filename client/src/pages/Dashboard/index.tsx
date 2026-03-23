// src/pages/Dashboard/index.tsx   
import type { FC } from "react";
import { Navigate } from "react-router-dom";

const DashboardHome: FC = () => {
  // IMPORTANT:
  // Use absolute path "/dashboard/overview" for predictable routing.
  return <Navigate to="/dashboard/overview" replace />;
};

export default DashboardHome;
