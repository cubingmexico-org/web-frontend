export interface Team {
  id: number;
  name: string;
  total_points: number;
  sponsor_id: number;
}

export interface Member {
  id: string;
  team_id: number;
  name: string;
}

export interface Competition {
  id: string;
  name: string;
  city: string;
  country: string;
  date: {
    from: string;
    till: string;
    numberOfDays: number;
  };
  isCanceled: boolean;
  wcaDelegates: {
    name: string;
    email: string;
  }[];
  organisers: {
    name: string;
    email: string;
  }[];
  venue: {
    name: string;
    address: string;
    details: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  information: string;
  externalWebsite: string | null;
  persons: Person[];
  events: Event[];
  schedule: {
    venues: {
      rooms: {
        activities: {
          activityCode: string;
          startTime: Date;
          endTime: Date;
        }[]
      }
    }[];
  };
}

export interface Score {
  id: number;
  member_id: string;
  competition_id: string;
  score: number;
}

export interface Sponsor {
  id: number;
  name: string;
}

export interface TableData {
  teamName: string;
  members: {
    id: string;
    name: string;
    scores: Record<string, number>;
  }[];
  totalPoints: number;
}

export interface Ranking {
  eventId: string;
  best: number;
  worldRanking: number;
  continentalRanking: number;
  nationalRanking: number;
  type: string;
}

export interface Attempt {
  result: number;
  reconstruction: null | string;
}

export interface Result {
  personId: number;
  ranking: number;
  attempts: Attempt[];
  best: number;
  average: number;
}

export interface AdvancementCondition {
  type: string;
  level: number;
}

export interface TimeLimit {
  centiseconds: number;
  cumulativeRoundIds: string[];
}

export interface Round {
  id: string;
  format: string;
  timeLimit: TimeLimit;
  cutoff: null | number;
  advancementCondition: AdvancementCondition;
  scrambleSetCount: number;
  results: Result[];
  extensions: unknown[];
}

export interface Event {
  id: string;
  rounds: Round[];
  extensions: unknown[];
  qualification: null | string;
}

export interface Person {
  registrantId: number;
  wcaId: string;
  name: string;
  countryIso2: string;
  personalBests: Ranking[];
}