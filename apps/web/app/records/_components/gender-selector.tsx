"use client";

import * as React from "react";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group";
import { cn } from "@workspace/ui/lib/utils";
import { parseAsString, useQueryStates } from "nuqs";

interface GenderSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function GenderSelector({ className, ...props }: GenderSelectorProps) {
  const [queryState, setQueryState] = useQueryStates(
    {
      gender: parseAsString.withDefault(""),
    },
    {
      clearOnDefault: true,
    },
  );

  const handleToggle = (value: string) => {
    setQueryState({ gender: queryState.gender === value ? "" : value });
  };
  
  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <span className="font-bold">Género</span>
      <div className="flex flex-wrap gap-2 text-muted-foreground">
        <ToggleGroup type="single" value={queryState.gender}>
          <ToggleGroupItem value="m" aria-label="Masculino" onClick={() => handleToggle("m")}>
            Masculino
          </ToggleGroupItem>
          <ToggleGroupItem value="f" aria-label="Femenino" onClick={() => handleToggle("f")}>
            Femenino
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}