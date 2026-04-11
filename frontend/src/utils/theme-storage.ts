import type { ThemeMode } from "../types/theme.types";

const THEME_KEY = "themeMode";

export const themeStorage = {
  getTheme(): ThemeMode | null {
    const value = localStorage.getItem(THEME_KEY);

    if (value === "light" || value === "dark") {
      return value;
    }

    return null;
  },

  setTheme(theme: ThemeMode): void {
    localStorage.setItem(THEME_KEY, theme);
  },
};