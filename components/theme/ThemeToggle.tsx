"use client";

import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="btn btn-link" type="button" onClick={toggleTheme}>
      {theme === "light" ? <IconMoon size={20} /> : <IconSun size={20} />}
    </button>
  );
}
