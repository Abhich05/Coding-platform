import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { authService } from '../../services/authService';
import { useUserStore } from '../../store/useUserStore';
import { useNavigate } from 'react-router-dom';

interface SignUpPageProps {
  isModal?: boolean;
  onClose?: () => void;
  onSwitchToSignIn?: () => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({
  onSwitchToSignIn,
}) => {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      const response = await authService.register({
        email: formData.email,
        fullName: formData.fullName || formData.email.split('@')[0],
        password: formData.password,
        role: formData.role,
      });

      console.log('Register response:', response);
      
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
        setUser(userObj);
        
        alert('Account created! Redirecting to dashboard...');
        
        setTimeout(() => {
          console.log('Navigating to dashboard');
          navigate('/dashboard/overview');
        }, 100);
      } else {
        setErrors({ email: 'Invalid response from server' });
      }
    } catch (error: any) {
      setErrors({
        email: error?.response?.data?.message || 'Registration failed',
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#02043A] px-4">
      <div className="relative w-full max-w-md rounded-[32px] bg-[#FDF4EE] shadow-[0_20px_60px_rgba(0,0,0,0.45)] border-3 border-[#F97316] px-8 py-10">
        <button
          type="button"
          className="absolute left-6 top-6 text-[#02043A] hover:text-[#111827]"
          onClick={() => navigate('/dashboard/overview')}
        >
          <span className="text-2xl font-light">←</span>
        </button>

        <div className="flex flex-col items-center mb-8 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-12 bg-[#F97316] opacity-20 blur-xl rounded-full pointer-events-none"></div>
          <div className="mt-2 text-base font-semibold text-[#02043A] relative z-10">TestPlatform</div>
          <h1 className="mt-4 text-2xl md:text-3xl font-bold text-[#02043A] text-center">
            Create Account!
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-xs font-medium text-[#02043A] mb-1.5">Full Name</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4B5563]" size={18} />
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border-2 bg-transparent text-[#02043A] outline-none border-[#02043A]`}
                placeholder="Full Name (optional)"
              />
            </div>
          </div>

          {/* 2. Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-[#02043A] mb-1.5">E-mail address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4B5563]" size={18} />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border-2 bg-transparent text-[#02043A] outline-none ${errors.email ? 'border-red-500' : 'border-[#02043A]'}`}
                placeholder="E-mail address"
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          {/* 3. Password & Confirm */}
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-[#02043A] mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4B5563]" size={18} />
                <input

                  id="password"
                  name="password"
                  autoComplete="current-password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border-2 bg-transparent text-[#02043A] outline-none ${errors.password ? 'border-red-500' : 'border-[#02043A]'}`}
                  placeholder="Password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5563]">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-medium text-[#02043A] mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4B5563]" size={18} />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border-2 bg-transparent text-[#02043A] outline-none ${errors.confirmPassword ? 'border-red-500' : 'border-[#02043A]'}`}
                  placeholder="Confirm Password"
                />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* 4. Role Selection */}
          <div>
            <label htmlFor="role" className="block text-xs font-medium text-[#02043A] mb-1.5">Select Role</label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4B5563]" size={18} />
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border-2 border-[#02043A] bg-transparent text-[#02043A] outline-none appearance-none cursor-pointer"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 w-full py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold flex items-center justify-center gap-2 shadow-md transition-colors"
          >
            <span>Sign up</span>
            <span>→</span>
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[#6B7280]">
          Have an account?{' '}
          <button type="button" onClick={() => navigate('/auth/signin')} className="font-semibold text-[#F97316] hover:text-[#EA580C]">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;