"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@workspace/ui/components/switch";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  if (!mounted) {
    return (
      <div className="flex items-center space-x-2 h-[24px] w-[99px]">
        <div className="h-[1.2rem] w-[1.2rem] bg-muted rounded-full animate-pulse" />
        <div className="h-[24px] w-[44px] bg-muted rounded-full animate-pulse" />
        <div className="h-[1.2rem] w-[1.2rem] bg-muted rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
      <Sun
        className={`h-[1.2rem] w-[1.2rem] transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          theme === "dark"
            ? "text-[#A1A1AA] scale-75 rotate-12"
            : "text-foreground scale-100 rotate-0"
        }`}
      />
      <Switch
        checked={theme === "dark"}
        onCheckedChange={toggleTheme}
        aria-label="Toggle theme"
        className="transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-110"
      />
      <Moon
        className={`h-[1.2rem] w-[1.2rem] transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          theme === "light"
            ? "text-[#A1A1AA] scale-75 rotate-12"
            : "text-foreground scale-100 rotate-0"
        }`}
      />
    </div>
  );
}
