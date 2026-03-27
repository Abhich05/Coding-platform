import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { authService } from '../../services/authService';
import { useUserStore } from '../../store/useUserStore';
import { useNavigate } from 'react-router-dom';

interface SignInPageProps {
  isOpen: boolean;
  onClose: () => void;
  onSignedIn?: (name: string) => void;
}

const SignInPage: React.FC<SignInPageProps> = ({ isOpen = true, onClose, onSignedIn }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("SUBMIT CLICKED", formData);
    if (!formData.email || !formData.password) {
      setErrors({ email: 'Credentials are required' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      console.log('Login response:', response);

      // Backend returns: { message: "...", data: { id, email } }
      // Extract the nested data object
      const userData = response?.data?.data || response?.data?.user || response?.data;
      
      console.log('Extracted userData:', userData);

      if (userData && userData.id && userData.email) {
        const userObj = {
          id: userData.id,
          email: userData.email,
          fullName: userData.fullName || formData.email.split('@')[0],
          role: userData.role || formData.role
        };
        console.log('Setting user:', userObj);
        
        // Update store - this will trigger Zustand persist middleware to save to localStorage
        setUser(userObj);
        
        onSignedIn?.(userObj.fullName);
        alert('Login Successful!');
        onClose();
        
        // Use a small delay to allow Zustand to persist and state to propagate
        // before triggering navigation which might cause ProtectedRoute to re-evaluate
        setTimeout(() => {
          console.log('Navigating to dashboard');
          navigate('/dashboard/overview', { replace: true });
        }, 100);
      } else {
        console.log('Missing required userData:', { userData });
        setErrors({ email: 'Invalid response from server' });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setErrors({ email: error?.response?.data?.message || 'Login failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy px-4">
      <div className="relative w-full max-w-md rounded-[32px] bg-cream shadow-[0_20px_60px_rgba(0,0,0,0.45)] border-3 border-orange px-8 py-10">
        <button type="button" className="absolute left-6 top-6 text-navy" onClick={onClose}>
          <span className="text-2xl font-light">←</span>
        </button>

        <div className="flex flex-col items-center mb-8 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-12 bg-orange opacity-20 blur-xl rounded-full"></div>
          <div className="mt-2 text-base font-semibold text-navy relative z-10">TestPlatform</div>
          <h1 className="mt-4 text-2xl font-bold text-navy text-center">Welcome Back!</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-navy mb-1.5">E-mail address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-custom" size={18} />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border-2 border-navy bg-transparent text-navy outline-none ${errors.email ? 'border-red-500' : ''}`}
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* 2. Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-xs font-medium text-navy">Password</label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-custom" size={18} />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border-2 border-navy bg-transparent text-black"
                placeholder="Password"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-custom">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* 3. Role */}
          <div>
            <label htmlFor="role" className="block text-xs font-medium text-navy mb-1.5">Login as</label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-custom" size={18} />
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border-2 border-navy bg-transparent text-navy outline-none appearance-none cursor-pointer"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-orange text-white font-semibold text-sm flex items-center justify-center gap-2"
          >
            {isLoading ? "Signing in..." : <><span>Sign in</span><span>→</span></>}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-light">
          Don't have an account?{' '}
          <button type="button" className="font-semibold text-orange" onClick={() => navigate('/auth/signup')}>
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;