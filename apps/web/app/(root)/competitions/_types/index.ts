export interface Competition {
  id: string;
  name: string;
  state: string | null;
  events: unknown;
  startDate: Date;
  endDate: Date;
  status: unknown;
  isChampionship: unknown;
}
