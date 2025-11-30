"use client";

import * as React from "react";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group";
import { useRouter } from "next/navigation";
import { cn } from "@workspace/ui/lib/utils";
import type { EventId } from "@/types/wca";

interface RankTypeSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
  selectedEventId: EventId;
  selectedRankType: "single" | "average";
  hrefSingle: string;
  hrefAverage: string;
  className?: string;
}

export function RankTypeSelector({
  selectedEventId,
  selectedRankType,
  hrefSingle,
  hrefAverage,
  className,
  ...props
}: RankTypeSelectorProps) {
  const router = useRouter();

  if (selectedEventId === "333mbf") return null;

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
          onClick={() => router.push(hrefSingle)}
        >
          Single
        </ToggleGroupItem>
        <ToggleGroupItem
          className="w-[50%]"
          value="average"
          aria-label="average"
          onClick={() => router.push(hrefAverage)}
        >
          Average
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
