import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/**
 * @typedef {"dark" | "light"} Theme
 * @typedef {{ theme: Theme, isDark: boolean, toggleTheme: () => void, setTheme: (t: Theme) => void }} ThemeContextValue
 */

const STORAGE_KEY = "app-theme";

/** @type {React.Context<ThemeContextValue | undefined>} */
const ThemeContext = createContext(undefined);

/**
 * Resolve the initial theme without flashing: an explicit user choice in
 * localStorage wins, otherwise fall back to the OS preference. Guarded for
 * non-browser environments (SSR / prerender / unit tests).
 * @returns {Theme}
 */
const readInitialTheme = () => {
  if (typeof window === "undefined") return "dark";

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "dark" || saved === "light") return saved;
  } catch {
    // Private-mode / blocked storage: fall through to the media query.
  }

  if (typeof window.matchMedia === "function") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  return "dark";
};

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(readInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.dataset.theme = theme;

    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Persisting is best-effort; the in-memory theme still applies.
    }
  }, [theme]);

  // Follow the OS only while the visitor has not made an explicit choice.
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return undefined;

    let stored = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      stored = null;
    }
    if (stored === "dark" || stored === "light") return undefined;

    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event) => setThemeState(event.matches ? "dark" : "light");

    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  const setTheme = useCallback((next) => {
    if (next === "dark" || next === "light") setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(
    () => ({ theme, isDark: theme === "dark", toggleTheme, setTheme }),
    [theme, toggleTheme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/** @returns {ThemeContextValue} */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeContext;
