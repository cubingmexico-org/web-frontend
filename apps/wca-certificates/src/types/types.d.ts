export interface Avatar {
  url: string;
  thumbUrl: string;
}

export interface Person {
  name: string;
  wcaUserId: number;
  wcaId: string;
  registrantId: number;
  countryIso2: string;
  gender: string;
  registration: { eventIds: string[] };
  avatar: Avatar;
  roles: unknown[];
  assignments: unknown[];
  personalBests: unknown[];
  extensions: unknown[];
}

export interface Result {
  personId: number;
  ranking: number;
  attempts: unknown[];
  best: number;
  average: number;
}

export interface Round {
  id: string;
  format: string;
  timeLimit: unknown;
  cutoff: unknown;
  advancementCondition: unknown;
  scrambleSetCount: number;
  results: Result[];
  extensions: unknown[];
}

export interface Event {
  id: string;
  rounds: Round[];
  extensions: unknown[];
  qualification: unknown;
}

export interface Data {
  name: string;
  schedule: {
    startDate: string,
    numberOfDays: number,
    venues: {
      latitudeMicrodegrees: number;
      longitudeMicrodegrees: number
    }[]
  };
  events: Event[];
  persons: Person[];
}

export interface ParticipantData {
  name: string;
  wcaId: string;
  results: {
    event: string;
    average: number;
    ranking: number;
  }[];
}