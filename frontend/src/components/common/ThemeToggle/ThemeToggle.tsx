import { useTheme } from "../../../hooks/useTheme";
import "./ThemeToggle.css";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      <span className="theme-toggle__icon">
        {theme === "light" ? "🌙" : "☀️"}
      </span>
      <span className="theme-toggle__text">
        {theme === "light" ? "Dark mode" : "Light mode"}
      </span>
    </button>
  );
}

export default ThemeToggle;