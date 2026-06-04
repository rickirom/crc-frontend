"use client";

import { useTheme } from "../../app/theme-provider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-md border px-3 py-2
                 bg-white dark:bg-zinc-900"
      aria-label="Toggle theme"
    >
      <span className="text-sm">Theme:</span>
      <strong className="text-sm">{theme}</strong>
    </button>
  );
}