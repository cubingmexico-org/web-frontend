export interface SumOfStateRanksEvent {
  eventId: string;
  stateRank: number;
  completed: boolean;
}

export interface SumOfStateRanks {
  rank: number | null;
  personId: string;
  name: string | null;
  overall: number | null;
  events: unknown;
  state: string | null;
  gender: string | null;
}
