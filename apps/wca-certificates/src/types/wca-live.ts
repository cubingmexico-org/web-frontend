export type EventId = '333' | '222' | '444' | '555' | '666' | '777' | '333bf' | '333fm' | '333oh' | '333ft' | 'clock' | 'minx' | 'pyram' | 'skewb' | 'sq1' | '444bf' | '555bf' | '333mbf'

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
  ranking: number | null;
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
  id: EventId;
  rounds: Round[];
  extensions: unknown[];
  qualification: unknown;
}

export interface Competition {
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
    event: EventId;
    average: number;
    ranking: number | null;
  }[];
}

export interface PodiumData {
  name: string;
  place: number;
  event: EventId;
  result: number;
}