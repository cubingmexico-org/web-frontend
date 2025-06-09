export type TeamMember = {
  id: string;
  name: string;
  scores: {
    competition: {
      id: string;
      name: string;
    };
    score: number;
  }[];
};

export type Team = {
  id: string;
  name: string;
  members: TeamMember[];
};

export interface Competitor {
  id: string;
  name: string;
  // Dynamically added properties for each competition, e.g., "Competition A": 100
  [competitionName: string]: string | number;
}

export interface TransformedMember {
  id: string;
  name: string;
  [competitionName: string]: string | number;
}

export interface TransformedTeam {
  id: string;
  name: string;
  members: TransformedMember[];
}
