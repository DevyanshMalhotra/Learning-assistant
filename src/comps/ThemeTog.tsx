import React from "react";
import { Sun, Moon } from "lucide-react";
import type { Theme } from "../utils/theme";

interface ThemeToggleProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export function ThemeToggle({ theme, onThemeChange }: ThemeToggleProps) {
  return (
    <button
      onClick={() => onThemeChange(theme === "light" ? "dark" : "light")}
      className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      ) : (
        <Sun className="w-5 h-5 text-gray-400 dark:text-gray-200" />
      )}
    </button>
  );
}
