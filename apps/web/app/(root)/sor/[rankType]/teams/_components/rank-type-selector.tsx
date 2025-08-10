"use client";

import * as React from "react";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group";
import { useRouter } from "next/navigation";
import { cn } from "@workspace/ui/lib/utils";

interface RankTypeSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
  selectedRankType: "single" | "average";
  className?: string;
}

export function RankTypeSelector({
  selectedRankType,
  className,
  ...props
}: RankTypeSelectorProps) {
  const router = useRouter();

  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <span className="font-semibold text-sm">Tipo</span>
      <ToggleGroup
        type="single"
        variant="outline"
        value={selectedRankType}
        className="w-full"
      >
        <ToggleGroupItem
          className="w-[50%]"
          value="single"
          aria-label="single"
          onClick={() => router.push(`/sor/single/teams`)}
        >
          Single
        </ToggleGroupItem>
        <ToggleGroupItem
          className="w-[50%]"
          value="average"
          aria-label="average"
          onClick={() => router.push(`/sor/average/teams`)}
        >
          Average
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
