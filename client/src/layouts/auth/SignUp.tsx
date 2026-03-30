import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, UserRound, UserPlus } from "lucide-react";
import { authService } from "../../services/authService";
import { useNavigate } from "react-router-dom";

type StatusState = {
    type: "success" | "error";
    message: string;
} | null;

const SignUpPage: React.FC = () => {
    const [formData, setFormData] = useState({
        email: "",
        fullName: "",
        password: "",
        confirmPassword: "",
        role: "candidate",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<StatusState>(null);

    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setStatus({ type: "error", message: "Please fix the highlighted fields." });
            return;
        }

        setErrors({});
        setStatus(null);
        setIsLoading(true);

        try {
            await authService.register({
                name: formData.fullName || formData.email.split("@")[0],
                email: formData.email,
                password: formData.password,
                role: formData.role as 'recruiter' | 'admin' | 'candidate',
            });

            setStatus({ type: "success", message: "Account created successfully. Redirecting to sign in..." });
            navigate("/auth/signin");
        } catch (error: unknown) {
            const message =
                typeof error === "object" &&
                    error !== null &&
                    "response" in error &&
                    typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === "string"
                    ? (error as { response?: { data?: { message?: string } } }).response?.data?.message ?? "Registration failed"
                    : "Registration failed";
            setErrors({ email: message });
            setStatus({ type: "error", message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    return (
        <div className="app-shell px-4 py-12 flex items-center justify-center">
            <div className="surface-panel w-full max-w-md p-7 md:p-8">

                <div className="mb-7">
                    <p className="text-xs uppercase tracking-[0.2em] muted-text">Test Platform</p>
                    <h1 className="mt-2 text-3xl font-bold">Create account</h1>
                    <p className="mt-2 muted-text">Get started with your coding dashboard in a few seconds.</p>
                </div>

                {status && (
                    <div className={`status-card mb-5 ${status.type}`} role="status" aria-live="polite">
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold mb-1.5 muted-text">Full name</label>
                        <div className="relative">
                            <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 muted-text" size={16} />
                            <input
                                name="fullName"
                                type="text"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className="input-field pl-10"
                                placeholder="Optional"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold mb-1.5 muted-text">E-mail address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 muted-text" size={16} />
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="input-field pl-10"
                                placeholder="name@example.com"
                            />
                        </div>
                        {errors.email && <p className="mt-1.5 text-xs text-red-300">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold mb-1.5 muted-text">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 muted-text" size={16} />
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleInputChange}
                                className="input-field pl-10 pr-10"
                                placeholder="Minimum 8 characters"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 muted-text"
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {errors.password && <p className="mt-1.5 text-xs text-red-300">{errors.password}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold mb-1.5 muted-text">Confirm password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 muted-text" size={16} />
                            <input
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className="input-field pl-10 pr-10"
                                placeholder="Confirm password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 muted-text"
                                aria-label="Toggle confirm password visibility"
                            >
                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-300">{errors.confirmPassword}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold mb-1.5 muted-text">Account role</label>
                        <div className="flex flex-col gap-2">
                            {["candidate", "recruiter"].map((role) => {
                                const isCandidate = role === "candidate";
                                const Icon = isCandidate ? UserRound : ShieldCheck;
                                return (
                                    <button
                                        key={role}
                                        type="button"
                                        onClick={() => setFormData((prev) => ({ ...prev, role }))}
                                        className={`w-full px-4 py-3 rounded-lg border flex items-center gap-2 text-left transition focus:outline-none ${formData.role === role
                                            ? "border-[var(--accent-strong)] bg-[var(--bg-secondary)] text-[var(--accent-strong)]"
                                            : "border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--accent)]"
                                            }`}
                                    >
                                        <Icon size={16} className="muted-text" />
                                        <span className="capitalize">{role}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <button type="submit" disabled={isLoading} className="btn-solid w-full inline-flex items-center justify-center gap-2">
                        <UserPlus size={16} />
                        {isLoading ? "Creating account..." : "Sign up"}
                    </button>
                </form>

                <p className="mt-6 text-sm muted-text text-center">
                    Already have an account?{" "}
                    <button
                        type="button"
                        className="font-semibold"
                        onClick={() => navigate("/auth/signin")}
                    >
                        Sign in
                    </button>
                </p>
            </div>
        </div>
    );
};

export default SignUpPage;
