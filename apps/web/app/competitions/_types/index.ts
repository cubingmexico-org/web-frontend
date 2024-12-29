export interface Competition {
  id: string;
  name: string;
  state: string;
  cityName: string;
  eventSpecs: string | null;
  day: number;
  month: number;
  year: number;
  endDay: number;
  endMonth: number;
}