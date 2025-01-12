"use client";

import * as React from "react";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group";
import { cn } from "@workspace/ui/lib/utils";

interface GenderSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function GenderSelector({ className, ...props }: GenderSelectorProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <span className="font-bold">Género</span>
      <div className="flex flex-wrap gap-2 text-muted-foreground">
        <ToggleGroup type="single" value={undefined}>
          <ToggleGroupItem value="m" aria-label="Masculino">
            Masculino
          </ToggleGroupItem>
          <ToggleGroupItem value="f" aria-label="Femenino">
            Femenino
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
