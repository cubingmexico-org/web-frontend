"use client";

import * as React from "react";
import { ToggleGroup, ToggleGroupItem } from "@workspace/ui/components/toggle-group";
import { useRouter } from "next/navigation";

interface RankTypeSelectorProps {
  selectedEventId: string;
}

export function RankTypeSelector({ selectedEventId }: RankTypeSelectorProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2">
      <span className="font-bold">Tipo</span>
      <div className="flex flex-wrap gap-2 text-muted-foreground">
        <ToggleGroup type="single" value="single">
          <ToggleGroupItem value="single" aria-label="" onClick={() => router.push(`/rankings/${selectedEventId}/single`)}>
            Single
          </ToggleGroupItem>
          <ToggleGroupItem value="average" aria-label="" onClick={() => router.push(`/rankings/${selectedEventId}/average`)}>
            Average
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
