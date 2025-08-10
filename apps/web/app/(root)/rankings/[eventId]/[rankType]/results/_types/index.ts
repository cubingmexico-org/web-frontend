export interface Result {
  personId: string;
  name: string | null;
  state: string | null;
  gender: string | null;
  competition: string;
  competitionId: string;
}

export type ResultSingle = Result & {
  best: number;
};

export type ResultAverage = Result & {
  average: number;
};
