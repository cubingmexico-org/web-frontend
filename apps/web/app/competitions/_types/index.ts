export interface Competition {
  id: string;
  name: string;
  state: string;
  cityName: string;
  eventSpecs: string | null;
  startDate: Date;
  endDate: Date;
}
