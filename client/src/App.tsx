// src/App.tsx
import { useEffect, type FC } from "react";
import AppRouter from "./router/AppRouter";

const App: FC = () => {
    // Apply saved or preferred theme class on first paint
    useEffect(() => {
        const saved = localStorage.getItem("theme-mode");
        const preferred =
            window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches
                ? "light"
                : "dark";
        document.documentElement.classList.toggle("theme-light", (saved ?? preferred) === "light");
    }, []);

    return <AppRouter />;
};

export default App;