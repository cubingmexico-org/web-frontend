export interface Result {
  index: number;
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
