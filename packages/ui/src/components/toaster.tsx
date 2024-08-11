/* eslint-disable @typescript-eslint/explicit-function-return-type -- .*/
"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

function Toaster({ ...props }: ToasterProps) {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      className="ui-toaster ui-group"
      theme={theme as "light" | "dark" | "system"}
      toastOptions={{
        classNames: {
          toast:
            "ui-group ui-toast group-[.toaster]:ui-bg-background group-[.toaster]:ui-text-foreground group-[.toaster]:ui-border-border group-[.toaster]:ui-shadow-lg",
          description: "group-[.toast]:ui-text-muted-foreground",
          actionButton:
            "group-[.toast]:ui-bg-primary group-[.toast]:ui-text-primary-foreground",
          cancelButton:
            "group-[.toast]:ui-bg-muted group-[.toast]:ui-text-muted-foreground",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
