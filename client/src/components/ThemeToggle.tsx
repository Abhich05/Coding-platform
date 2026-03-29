// src/components/ThemeToggle.tsx
import { Sun, Moon } from "lucide-react";
import { useState } from "react";

/**
 * Self-contained theme toggle pill.
 * Reads the current class on <html> so it stays in sync
 * even when rendered inside a layout (not at app root).
 */
export const ThemeToggle = () => {
    const [isLight, setIsLight] = useState(() =>
        document.documentElement.classList.contains("theme-light")
    );

    const toggle = () => {
        const next = !isLight;
        setIsLight(next);
        localStorage.setItem("theme-mode", next ? "light" : "dark");
        document.documentElement.classList.toggle("theme-light", next);
    };

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label={isLight ? "Switch to Graphite (dark)" : "Switch to Marble (light)"}
            title={isLight ? "Switch to Graphite" : "Switch to Marble"}
            className="
        relative inline-flex items-center
        w-12 h-6 shrink-0
        rounded-full
        border border-[var(--border)]
        bg-[var(--bg-secondary)]
        transition-colors duration-300
        focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-1
        cursor-pointer
      "
        >
            {/* Sliding knob */}
            <span
                className={`
          absolute flex items-center justify-center
          w-5 h-5 rounded-full
          bg-[var(--accent-strong)]
          text-[var(--bg-primary)]
          shadow-sm
          transition-transform duration-300 ease-in-out
          ${isLight ? "translate-x-[1.375rem]" : "translate-x-0.5"}
        `}
            >
                {isLight
                    ? <Sun size={11} strokeWidth={2.5} />
                    : <Moon size={11} strokeWidth={2.5} />
                }
            </span>
        </button>
    );
};
