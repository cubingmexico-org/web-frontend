export interface StreakRanks {
  rank: number;
  personId: string;
  name: string | null;
  currentStreak: number;
  longestStreak: number;
  state: string | null;
  gender: string | null;
}
