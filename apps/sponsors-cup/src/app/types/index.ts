export interface Member {
  id: string;
  name: string;
  team: Team;
}

export interface Team {
  id: string;
  name: string;
  sponsor: Sponsor;
}

export interface Sponsor {
  id: string;
  name: string;
  image: string | null;
  url: string | null;
}

export interface TableDataByTeam extends TeamMember {
  team_name: string;
  total_score: string;
}

export interface TeamMember {
  member_id: string;
  member_name: string;
  [key: string]: string;
}

export type GroupedData = Record<
  string,
  {
    members: TeamMember[];
    total_score: number;
  }
>;

export interface TableDataByCompetitor extends TeamMember {
  total_score: string;
}

export interface CompetitorTable {
  member_id: string;
  member_name: string;
  competition_id: string;
  competition_name: string;
  score: number;
}
