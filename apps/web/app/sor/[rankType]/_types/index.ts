interface Rank {
  personId: string;
  countryRank: number;
  name: string | null;
  state: string | null;
  gender: string | null;
}

export type RankSingle = Rank;
export type RankAverage = Rank;
