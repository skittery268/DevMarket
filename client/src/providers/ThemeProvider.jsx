// React tools
import { useState, useEffect, useCallback, useMemo } from "react";

// Theme context
import { ThemeContext } from "../context/ThemeContext";

// ---------------------------------------IMPORTS---------------------------------------

// localStorage key + allowed values
const STORAGE_KEY = "theme";
const THEMES = ["light", "dark"];

// Read the persisted theme, falling back to the light theme. The same logic
// runs in an inline <script> in index.html to apply the class before paint,
// so this only mirrors that decision into React state.
const getInitialTheme = () => {
    if (typeof window === "undefined") return "light";

    const stored = localStorage.getItem(STORAGE_KEY);
    return THEMES.includes(stored) ? stored : "light";
};

// Provider that owns the light/dark theme, persists it, and keeps the
// `dark` class on <html> in sync. Purely visual — no app logic depends on it.
export const ThemeProvider = ({ children }) => {
    const [theme, setThemeState] = useState(getInitialTheme);

    // Reflect the current theme onto <html> and mirror it into localStorage.
    useEffect(() => {
        const root = document.documentElement;

        root.classList.toggle("dark", theme === "dark");
        root.style.colorScheme = theme;
        localStorage.setItem(STORAGE_KEY, theme);
    }, [theme]);

    // Set an explicit theme (guards against unknown values).
    const setTheme = useCallback((next) => {
        setThemeState((prev) => (THEMES.includes(next) ? next : prev));
    }, []);

    // Flip between light and dark.
    const toggleTheme = useCallback(() => {
        setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
    }, []);

    const value = useMemo(
        () => ({ theme, isDark: theme === "dark", setTheme, toggleTheme }),
        [theme, setTheme, toggleTheme]
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
