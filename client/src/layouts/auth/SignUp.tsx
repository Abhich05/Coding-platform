import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Check, X } from 'lucide-react';

interface SignUpPageProps {
  isModal?: boolean;
  onClose?: () => void;
  onSwitchToSignIn?: () => void;
}

const LinkedInIcon = () => (
  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.3 8.5h4.4V24H.3zM8.34 8.5h4.22v2.11h.06c.59-1.12 2.03-2.3 4.18-2.3 4.47 0 5.29 2.94 5.29 6.76V24h-4.4v-7.18c0-1.71-.03-3.9-2.38-3.9-2.38 0-2.75 1.86-2.75 3.78V24H8.34z"
    />
  </svg>
);

const GitHubIcon = () => (
  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2.1c-3.2.7-3.8-1.5-3.8-1.5-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.9 1.3 3.6 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.4-1.3-5.4-5.8 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.5.1-3 0 0 1-.3 3.3 1.2a11.2 11.2 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.5.2 2.7.1 3 .8.9 1.2 2 1.2 3.2 0 4.5-2.8 5.5-5.4 5.8.4.3.8 1 .8 2.1v3.1c0 .3.2.7.8.6A10.99 10.99 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M22.5 12a10.5 10.5 0 1 0-12.1 10.4v-7.4H7.4V12h3V9.7c0-3 1.8-4.6 4.5-4.6 1.3 0 2.6.2 2.6.2v2.9h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3h-2.9v7.4A10.5 10.5 0 0 0 22.5 12z"
    />
  </svg>
);

const SignUpPage: React.FC<SignUpPageProps> = ({
  isModal = false,
  onClose,
  onSwitchToSignIn,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

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

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms';
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    console.log('Sign up submitted:', {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
    });

    alert('Account created successfully! Please check your email to verify your account.');

    if (isModal && onClose) {
      setTimeout(() => onClose(), 1000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSocialSignup = (provider: string) => {
    console.log(`Sign up with ${provider}`);
    alert(`Redirecting to ${provider} authentication...`);
  };

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
    isModal ? (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#010440]/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="w-full max-w-md mx-4 rounded-2xl bg-[#020f59] shadow-2xl border border-white/10 p-6 sm:p-8 text-[#F2EEE9]"
          onClick={e => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    ) : (
      <div className="min-h-screen flex items-center justify-center bg-[#010440]">
        <div className="w-full max-w-md mx-auto rounded-2xl bg-[#020f59] shadow-2xl border border-white/10 p-6 sm:p-8 text-[#F2EEE9]">
          {children}
        </div>
      </div>
    );

  return (
    <Wrapper>
      <div className="relative">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-0 top-0 text-[#8A8BA6] hover:text-[#F2EEE9]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <h2 className="text-xl font-semibold text-[#F2EEE9] mb-1">
          Create your account
        </h2>
        <p className="text-sm text-[#8A8BA6] mb-6">
          Join CodePlatform to access all features.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-[#F2EEE9] mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8BA6]" size={18} />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-3 py-2.5 text-sm rounded-lg border bg-[#010440] text-[#F2EEE9] outline-none transition-all
                focus:ring-2 focus:ring-[#F25116]/70 focus:border-[#F25116]
                placeholder:text-[#8A8BA6]
                ${errors.fullName ? 'border-red-500 focus:ring-red-500/60 focus:border-red-500' : 'border-white/10 hover:border-white/20'}`}
                placeholder="Enter your full name"
              />
            </div>
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-400">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#F2EEE9] mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8BA6]" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-3 py-2.5 text-sm rounded-lg border bg-[#010440] text-[#F2EEE9] outline-none transition-all
                focus:ring-2 focus:ring-[#F25116]/70 focus:border-[#F25116]
                placeholder:text-[#8A8BA6]
                ${errors.email ? 'border-red-500 focus:ring-red-500/60 focus:border-red-500' : 'border-white/10 hover:border-white/20'}`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[#F2EEE9] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8BA6]" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-lg border bg-[#010440] text-[#F2EEE9] outline-none transition-all
                focus:ring-2 focus:ring-[#F25116]/70 focus:border-[#F25116]
                placeholder:text-[#8A8BA6]
                ${errors.password ? 'border-red-500 focus:ring-red-500/60 focus:border-red-500' : 'border-white/10 hover:border-white/20'}`}
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8BA6] hover:text-[#F2EEE9] transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-400">{errors.password}</p>
            )}
            <p className="mt-1 text-xs text-[#8A8BA6]">
              Must be at least 8 characters.
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-[#F2EEE9] mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8BA6]" size={18} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-lg border bg-[#010440] text-[#F2EEE9] outline-none transition-all
                focus:ring-2 focus:ring-[#F25116]/70 focus:border-[#F25116]
                placeholder:text-[#8A8BA6]
                ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500/60 focus:border-red-500' : 'border-white/10 hover:border-white/20'}`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8BA6] hover:text-[#F2EEE9] transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Terms */}
          <div>
            <label className="flex items-start space-x-2 cursor-pointer">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className={`mt-0.5 w-4 h-4 rounded border cursor-pointer transition-colors
                  ${errors.agreeToTerms ? 'border-red-500' : 'border-[#8A8BA6]'}
                  accent-[#F25116] bg-transparent`}
                />
              </div>
              <span className="text-xs text-[#F2EEE9] leading-snug">
                I agree to CodePlatform&apos;s{' '}
                <a href="#" className="text-[#F25116] hover:underline font-medium">
                  Terms
                </a>{' '}
                and{' '}
                <a href="#" className="text-[#F25116] hover:underline font-medium">
                  Privacy Policy
                </a>
                .
              </span>
            </label>
            {errors.agreeToTerms && (
              <p className="mt-1 text-xs text-red-400">{errors.agreeToTerms}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 bg-[#F25116] hover:bg-[#ff6a33] text-[#F2EEE9] py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#F25116]/70 focus:ring-offset-2 focus:ring-offset-[#010440]"
          >
            Sign up
          </button>

          {/* Divider */}
          <div className="relative my-3">
            <div className="relative flex justify-center">
              <span className="px-3 bg-[#020f59] text-[11px] font-medium text-[#8A8BA6] uppercase tracking-wide">
                or
              </span>
            </div>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={() => handleSocialSignup('Google')}
            className="w-full py-2.5 text-sm border border-white/15 hover:border-white/30 bg-[#010440] hover:bg-[#020f59] rounded-lg font-medium flex items-center justify-center space-x-2 text-[#F2EEE9] transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-[#F2EEE9]">Continue with Google</span>
          </button>

          {/* Other providers */}
          <div className="grid grid-cols-3 gap-2">
            {['LinkedIn', 'GitHub', 'Facebook'].map(provider => {
              const Icon =
                provider === 'LinkedIn'
                  ? LinkedInIcon
                  : provider === 'GitHub'
                  ? GitHubIcon
                  : FacebookIcon;

              return (
                <button
                  key={provider}
                  type="button"
                  onClick={() => handleSocialSignup(provider)}
                  className="py-2 text-xs bg-[#010440] hover:bg-[#020f59] border border-white/15 rounded-lg font-medium flex items-center justify-center text-[#F2EEE9] transition-colors"
                >
                  <Icon />
                  <span>{provider}</span>
                </button>
              );
            })}
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-[#8A8BA6]">
          Already have an account{' '}
          <button
            type="button"
            onClick={() => {
              onClose?.();
              onSwitchToSignIn?.();
            }}
            className="font-semibold text-[#F25116] hover:text-[#F2EEE9]"
          >
            Sign in
          </button>
        </p>
      </div>
    </Wrapper>
  );
};

export default SignUpPage;
