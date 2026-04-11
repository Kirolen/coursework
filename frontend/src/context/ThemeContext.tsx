import { createContext, useEffect, useMemo, useState } from "react";
import type { ThemeContextValue, ThemeMode } from "../types/theme.types";
import { themeStorage } from "../utils/theme-storage";

interface ThemeProviderProps {
  children: React.ReactNode;
}

const getInitialTheme = (): ThemeMode => {
  const savedTheme = themeStorage.getTheme();

  if (savedTheme) {
    return savedTheme;
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined
);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeMode>(getInitialTheme);

  const setTheme = (value: ThemeMode) => {
    setThemeState(value);
    themeStorage.setTheme(value);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      toggleTheme,
      setTheme,
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}