export interface Competition {
  id: string;
  name: string;
  state: string | null;
  cityName: string;
  events: unknown;
  startDate: Date;
  endDate: Date;
}
