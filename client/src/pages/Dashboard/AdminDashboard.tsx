import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/Authcontext';
import { authService } from '../../services/authService';

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    // clear backend-related/localStorage stuff
    authService.logout(); // removes auth_token and user-storage
    // clear context
    logout();
    // redirect to signin
    navigate('/auth/signin', { replace: true });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <p>Welcome, admin. Put your admin widgets here.</p>
    </div>
  );
};

export default AdminDashboard;
