import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';

interface Props {
  children: ReactNode;
  requiredRole?: 'admin' | 'user';
}

export const ProtectedRoute: React.FC<Props> = ({ children, requiredRole }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/auth/signin" replace />;

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard/overview" replace />;
  }

  return <>{children}</>;
};
