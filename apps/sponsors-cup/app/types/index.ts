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

export type Competitor = {
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
