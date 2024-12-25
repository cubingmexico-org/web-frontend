"use client";

import { useRouter } from "next/navigation";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@repo/ui/select";
import type { State } from "@/lib/db/schema";

interface StateSelectProps {
  states: State[];
  initialSelectedStateId?: string;
}

export function StateSelect({
  states,
  initialSelectedStateId = "all",
}: StateSelectProps): JSX.Element {
  const router = useRouter();

  return (
    <Select defaultValue={initialSelectedStateId} onValueChange={(stateId) => {
      if (stateId === "all") { router.push("/competitions"); return; }
      router.push(`/competitions/${stateId}`);
    }}>
      <SelectTrigger className="w-full sm:w-[200px]">
        <SelectValue placeholder="Select event" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">
          Todo el país
        </SelectItem>
        {states.map((state) => (
          <SelectItem key={state.id} value={state.id}>
            {state.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}