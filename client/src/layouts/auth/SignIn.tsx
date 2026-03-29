import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, LogIn, UserRound } from "lucide-react";
import { authService } from "../../services/authService";
import { useUserStore } from "../../store/useUserStore";
import { useNavigate } from "react-router-dom";

type StatusState = {
    type: "success" | "error";
    message: string;
} | null;

const SignInPage: React.FC = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "user",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<StatusState>(null);

    const navigate = useNavigate();
    const setUser = useUserStore((state) => state.setUser);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setErrors({ email: "Credentials are required" });
            setStatus({ type: "error", message: "Please enter your email and password." });
            return;
        }

        setIsLoading(true);
        setErrors({});
        setStatus(null);

        try {
            const response = await authService.login({
                email: formData.email,
                password: formData.password,
                role: formData.role,
            });

            const userData = response?.data?.data || response?.data?.user || response?.data;

            if (!userData?.id || !userData?.email) {
                throw new Error("Invalid server response");
            }

            const userObj = {
                id: userData.id,
                email: userData.email,
                fullName: userData.fullName || formData.email.split("@")[0],
                role: userData.role || "user",
            };

            setUser(userObj);
            setStatus({ type: "success", message: "Login successful. Redirecting..." });

            if (userObj.role === "admin") {
                navigate("/admin/overview", { replace: true });
            } else {
                navigate("/dashboard/overview", { replace: true });
            }
        } catch (error: unknown) {
            const message =
                typeof error === "object" &&
                    error !== null &&
                    "response" in error &&
                    typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === "string"
                    ? (error as { response?: { data?: { message?: string } } }).response?.data?.message ?? "Login failed"
                    : "Login failed";
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
        <div className="app-shell px-4 py-16 flex items-center justify-center">
            <div className="surface-panel w-full max-w-md p-7 md:p-8">

                <div className="mb-7">
                    <p className="text-xs uppercase tracking-[0.2em] muted-text">Test Platform</p>
                    <h1 className="mt-2 text-3xl font-bold">Sign in</h1>
                    <p className="mt-2 muted-text">Access your dashboard with your account credentials.</p>
                </div>

                {status && (
                    <div className={`status-card mb-5 ${status.type}`} role="status" aria-live="polite">
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
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
                                placeholder="Enter password"
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
                    </div>

                    <div>
                        <label className="block text-xs font-semibold mb-1.5 muted-text">Login as</label>
                        <div className="flex flex-col gap-2">
                            {["user", "admin"].map((role) => {
                                const isUser = role === "user";
                                const Icon = isUser ? UserRound : ShieldCheck;
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
                        <LogIn size={16} />
                        {isLoading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <p className="mt-6 text-sm muted-text text-center">
                    Don’t have an account?{" "}
                    <button
                        type="button"
                        className="font-semibold"
                        onClick={() => navigate("/auth/signup")}
                    >
                        Sign up
                    </button>
                </p>
            </div>
        </div>
    );
};

export default SignInPage;
