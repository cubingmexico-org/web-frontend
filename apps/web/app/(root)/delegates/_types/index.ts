import type { DelegateLevel } from "@/lib/delegate-level";

export interface Person {
  wcaId: string;
  name: string | null;
  gender: string | null;
  state: string | null;
  status: "active" | "inactive" | null;
  level: DelegateLevel | null;
  competitions: number;
}
