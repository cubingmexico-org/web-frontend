export interface Person {
  id: string;
  name: string | null;
  gender: string | null;
  state: string | null;
  status: "active" | "inactive" | null;
  competitions: number;
}
