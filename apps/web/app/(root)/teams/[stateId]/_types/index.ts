import { Person, TeamMember } from "@/db/schema";

export interface Member {
  id: Person["id"];
  name: Person["name"];
  gender: Person["gender"];
  isAdmin: TeamMember["isAdmin"] | null;
  podiums: number;
  stateRecords: unknown;
  specialties: TeamMember["specialties"];
  // achievements: TeamMember["achievements"];
}
