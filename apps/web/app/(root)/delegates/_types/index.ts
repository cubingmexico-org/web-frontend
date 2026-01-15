export interface Person {
  wcaId: string;
  name: string | null;
  gender: string | null;
  state: string | null;
  status: "active" | "inactive" | null;
  competitions: number;
}
