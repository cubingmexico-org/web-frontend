"use client";

import * as React from "react";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@workspace/ui/lib/utils";

interface ResultTypeSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
  hrefResults: string;
  hrefPersons: string;
  className?: string;
}

export function ResultTypeSelector({
  hrefResults,
  hrefPersons,
  className,
  ...props
}: ResultTypeSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <span className="font-semibold text-sm">Mostrar</span>
      <ToggleGroup
        type="single"
        variant="outline"
        value={pathname.includes("results") ? "results" : "persons"}
        className="w-full"
      >
        <ToggleGroupItem
          className="w-[50%]"
          value="persons"
          aria-label="persons"
          onClick={() => router.push(hrefPersons)}
        >
          Personas
        </ToggleGroupItem>
        <ToggleGroupItem
          className="w-[50%]"
          value="results"
          aria-label="results"
          onClick={() => router.push(hrefResults)}
        >
          Resultados
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
