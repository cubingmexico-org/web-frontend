export interface Competition {
  id: string;
  name: string;
  city: string;
  country: string;
  date: Date;
  isCanceled: boolean;
  events: string[];
  wcaDelegates: WCADelegate[];
  organisers: Organizer[];
  venue: Venue;
  information: string;
  externalWebsite: string | null;
}

interface Date {
  from: string;
  till: string;
  numberOfDays: number;
}

interface Person {
  name: string;
  wcaId: string;
}

type WCADelegate = Person;
type Organizer = Person;

interface Venue {
  name: string;
  address: string;
  details: string;
  coordinates: Coordinates;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}
