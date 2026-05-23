"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group";
import { cn } from "@workspace/ui/lib/utils";

interface RankTypeSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
  stateId: string;
  selectedRankType: "single" | "average";
  className?: string;
}

export function RankTypeSelector({
  stateId,
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
          onClick={() => router.push(`/sosr/${stateId}/single`)}
        >
          Single
        </ToggleGroupItem>
        <ToggleGroupItem
          className="w-[50%]"
          value="average"
          aria-label="average"
          onClick={() => router.push(`/sosr/${stateId}/average`)}
        >
          Average
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
