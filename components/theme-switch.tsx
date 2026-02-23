"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

interface ThemeSwitchProps {
  collapsed?: boolean;
}

export function ThemeSwitch({ collapsed = false }: ThemeSwitchProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <button
        className="flex items-center gap-3 rounded-md p-3 text-muted-foreground transition-all duration-200"
        aria-label="Toggle theme"
        disabled
      >
        <div className="flex h-6 w-6 items-center justify-center">
          <Sun className="h-5 w-5" />
        </div>
        {!collapsed && <span className="text-sm">Theme</span>}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex w-full items-center justify-center gap-3 rounded-md p-3 text-sidebar-foreground transition-all duration-200 hover:bg-sidebar-icon-bg-hover hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-sidebar-background"
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
      title={
        collapsed
          ? `Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`
          : undefined
      }
    >
      <div className="flex h-6 w-6 items-center justify-center">
        {resolvedTheme === "dark" ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </div>
      {!collapsed && (
        <span className="text-sm">
          {resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </button>
  );
}
