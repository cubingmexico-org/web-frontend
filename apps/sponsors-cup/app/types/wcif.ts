interface RegistrationInfo {
  openTime: string;
  closeTime: string;
  baseEntryFee: number;
  currencyCode: string;
  onTheSpotRegistration: boolean;
  useWcaRegistration: boolean;
}

interface Activity {
  id: number;
  name: string;
  activityCode: string;
  startTime: string;
  endTime: string;
  childActivities: Activity[];
  // extensions: any[];
}

interface Room {
  id: number;
  name: string;
  color: string;
  activities: Activity[];
  // extensions: any[];
}

interface Venue {
  id: number;
  name: string;
  latitudeMicrodegrees: number;
  longitudeMicrodegrees: number;
  countryIso2: string;
  timezone: string;
  rooms: Room[];
  // extensions: any[];
}

interface Schedule {
  startDate: string;
  numberOfDays: number;
  venues: Venue[];
  // extensions: any[];
}

interface TimeLimit {
  centiseconds: number;
  cumulativeRoundIds: string[];
}

interface AdvancementCondition {
  type: string;
  level: number;
}

interface Attempt {
  result: number;
  reconstuction: null;
}

interface Result {
  personId: number;
  ranking: number;
  attempts: Attempt[];
  best: number;
  average: number;
}

interface Round {
  id: string;
  format: string;
  timeLimit: TimeLimit;
  cutoff: null;
  advancementCondition: AdvancementCondition | null;
  scrambleSetCount: number;
  results: Result[];
  // extensions: any[];
}

interface Event {
  id: string;
  rounds: Round[];
  // extensions: any[];
  qualification: null;
}

interface Registration {
  wcaRegistrationId: number;
  eventIds: string[];
  status: string;
  isCompeting: boolean;
}

interface Avatar {
  url: string;
  thumbUrl: string;
}

interface PersonalBest {
  eventId: string;
  best: number;
  worldRanking: number;
  continentalRanking: number;
  nationalRanking: number;
  type: string;
}

interface Person {
  name: string;
  wcaUserId: number;
  wcaId: string;
  registrantId: number;
  countryIso2: string;
  gender: string;
  registration: Registration;
  avatar: Avatar;
  roles: string[];
  // assignments: any[];
  personalBests: PersonalBest[];
  // extensions: any[];
}

export interface Competition {
  formatVersion: string;
  id: string;
  name: string;
  shortName: string;
  series: null;
  persons: Person[];
  events: Event[];
  schedule: Schedule;
  competitorLimit: number;
  // extensions: any[];
  registrationInfo: RegistrationInfo;
}
