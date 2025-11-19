export type EventId =
  | "333"
  | "222"
  | "444"
  | "555"
  | "666"
  | "777"
  | "333bf"
  | "333fm"
  | "333oh"
  | "333ft"
  | "clock"
  | "minx"
  | "pyram"
  | "skewb"
  | "sq1"
  | "444bf"
  | "555bf"
  | "333mbf";

export interface Avatar {
  url: string;
  thumbUrl: string;
}

export type Role =
  | "staff-other"
  | "staff-judge"
  | "staff-scrambler"
  | "staff-judge"
  | "delegate"
  | "organizer";

export interface Person {
  name: string;
  wcaUserId: number;
  wcaId: string | null;
  registrantId: number;
  countryIso2: string;
  gender: "m" | "f" | "o" | null;
  registration: Registration;
  avatar: Avatar | null;
  roles: Role[];
  assignments: Assignment[];
  personalBests: PersonalBest[];
  extensions: unknown[];
}

interface Registration {
  wcaRegistrationId: number;
  eventIds: string[];
  status: string; // "accepted"
  isCompeting: boolean;
}

interface Assignment {
  activityId: number;
  stationNumber: number;
  assignmentCode: "competidor" | Role;
}

interface PersonalBest {
  eventId: EventId;
  best: number;
  worldRanking: number | null;
  continentalRanking: number | null;
  nationalRanking: number | null;
  type: "single" | "average";
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

export interface WCIF {
  id: string;
  name: string;
  schedule: Schedule;
  competitorLimit: number;
  events: Event[];
  persons: Person[];
}

interface Schedule {
  startDate: string;
  numberOfDays: number;
  venues: Venue[];
}

interface Venue {
  latitudeMicrodegrees: number;
  longitudeMicrodegrees: number;
}

export interface ParticipantData {
  name: string;
  wcaId: string | null;
  registrantId: number | null;
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

export interface ExtendedPerson extends Person {
  stateId: string | null;
}
