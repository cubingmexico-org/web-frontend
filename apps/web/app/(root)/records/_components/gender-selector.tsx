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
      shallow: false,
    },
  );

  const memoizedGender = React.useMemo(() => {
    return queryState.gender;
  }, [queryState]);

  const handleToggle = (value: string) => {
    setQueryState({ gender: memoizedGender === value ? "" : value });
  };

  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <span className="font-semibold text-sm">Género</span>
      <ToggleGroup
        type="single"
        variant="outline"
        value={memoizedGender}
        className="w-full"
      >
        <ToggleGroupItem
          className="w-[50%]"
          value="m"
          aria-label="Masculino"
          onClick={() => handleToggle("m")}
        >
          Masculino
        </ToggleGroupItem>
        <ToggleGroupItem
          className="w-[50%]"
          value="f"
          aria-label="Femenino"
          onClick={() => handleToggle("f")}
        >
          Femenino
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
