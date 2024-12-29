"use client";

import { useParams, useRouter } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@workspace/ui/components/select";
import type { State } from "@/lib/db/schema";

interface StateSelectProps {
  states: State[];
}

export function StateSelect({
  states,
}: StateSelectProps): JSX.Element {
  const router = useRouter();
  const params = useParams<{ stateId: string }>()

  return (
    <Select
      defaultValue={params.stateId || "all"}
      onValueChange={(stateId) => {
        if (stateId === "all") {
          router.push("/competitions");
          return;
        }
        router.push(`/competitions/${stateId}`);
      }}
    >
      <SelectTrigger className="w-full sm:w-[200px]">
        <SelectValue placeholder="Select event" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todo el país</SelectItem>
        {states.map((state) => (
          <SelectItem key={state.id} value={state.id}>
            {state.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
