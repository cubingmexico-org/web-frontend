interface Rank {
  personId: string;
  countryRank: number;
  name: string;
  best: number;
  state: string;
  gender: string;
}

export type RankSingle = Rank;
export type RankAverage = Rank;
