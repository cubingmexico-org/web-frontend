/* eslint-disable @typescript-eslint/explicit-function-return-type -- . */

"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Switch } from "@repo/ui/switch"


export function ModeToggle(): JSX.Element {
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  return (
    <div className="flex gap-2">
      <Switch
        checked={isDarkMode}
        onCheckedChange={toggleTheme}
      />
      {isDarkMode ? <Moon /> : <Sun />}
    </div>
  )
}
