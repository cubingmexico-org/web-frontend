import { faker } from "@faker-js/faker";
import type { Event, Person, Result, EventId, Round } from "@/types/wcif";

interface ApplicationError extends Error {
  info: string;
  status: number;
}

export const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error(
      "An error occurred while fetching the data.",
    ) as ApplicationError;

    error.info = await res.json();
    error.status = res.status;

    throw error;
  }

  return res.json();
};

export function processPersons(persons: Person[]) {
  const getRole = (role: string) => (person: Person) =>
    person.roles.includes(role);
  const getName = (person: Person) => person.name;

  const delegates = persons.filter(getRole("delegate")).map(getName);
  const organizers = persons.filter(getRole("organizer")).map(getName);

  const personIdToName: Record<string, string> = {};
  persons.forEach((person: Person) => {
    personIdToName[person.registrantId] = person.name;
  });

  function getEventData(event: Event) {
    const rounds = event.rounds;
    const results = rounds[rounds.length - 1]?.results
      .filter(
        (result: Result) =>
          result.ranking !== null &&
          result.best !== -1 &&
          result.best !== -2 &&
          result.ranking >= 1 &&
          result.ranking <= 3,
      )
      .sort((a, b) => a.ranking! - b.ranking!)
      .map((person) => ({
        personName: personIdToName[person.personId],
        result:
          event.id === "333bf" ||
          event.id === "444bf" ||
          event.id === "555bf" ||
          event.id === "333mbf"
            ? person.best
            : person.average,
      }));

    return results;
  }

  return {
    delegates,
    organizers,
    getEventData,
  };
}

export function transformString(
  s: string,
  caseType?: "lowercase" | "capitalize" | "uppercase" | "none",
): string {
  if (typeof s !== "string") return "";
  switch (caseType) {
    case "lowercase":
      return s.toLowerCase();
    case "capitalize":
      return s
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    case "uppercase":
      return s.toUpperCase();
    default:
      return s;
  }
}

export function formatResults(result: number, eventId: EventId): string {
  if (result === -1) {
    return "DNF";
  }

  if (result === -2) {
    return "DNS";
  }

  if (eventId === "333mbf") {
    const valueStr = result.toString();
    const DD = valueStr.slice(0, 2);
    const TTTTT = valueStr.slice(2, 7);
    const MM = valueStr.slice(7);

    const difference = 99 - parseInt(DD);
    const missed = parseInt(MM);
    const solved = difference + missed;
    const attempted = solved + missed;

    const TTTTTInt = parseInt(TTTTT);
    const minutes = Math.floor(TTTTTInt / 60);
    const seconds = TTTTTInt % 60;
    const time = `${solved}/${attempted} en ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

    return time;
  }

  const number = result / 100;
  let time: string;

  if (number >= 60) {
    const minutes = Math.floor(number / 60);
    const seconds = number % 60;
    time = `${minutes}:${seconds < 10 ? "0" : ""}${seconds.toFixed(2)}`;
  } else {
    time = number.toFixed(2);
  }

  return time;
}

export function formatEvents(eventId: EventId) {
  switch (eventId) {
    case "333":
      return "3x3x3";
    case "222":
      return "2x2x2";
    case "444":
      return "4x4x4";
    case "555":
      return "5x5x5";
    case "666":
      return "6x6x6";
    case "777":
      return "7x7x7";
    case "333bf":
      return "3x3x3 A Ciegas";
    case "333fm":
      return "3x3x3 Menos Movimientos";
    case "333oh":
      return "3x3x3 A Una Mano";
    case "clock":
      return "Clock";
    case "minx":
      return "Megaminx";
    case "pyram":
      return "Pyraminx";
    case "skewb":
      return "Skewb";
    case "sq1":
      return "Square-1";
    case "444bf":
      return "4x4x4 A Ciegas";
    case "555bf":
      return "5x5x5 A Ciegas";
    case "333mbf":
      return "3x3x3 Múltiples A Ciegas";
    default:
      return eventId;
  }
}

export function formatPlace(
  place: number,
  formatType: "cardinal" | "ordinal" | "ordinal_text" | "medal" | "other",
): string {
  switch (formatType) {
    case "cardinal":
      switch (place) {
        case 1:
          return "1";
        case 2:
          return "2";
        case 3:
          return "3";
        default:
          return String(place);
      }
    case "ordinal":
      switch (place) {
        case 1:
          return "1er";
        case 2:
          return "2do";
        case 3:
          return "3er";
        default:
          return String(place);
      }
    case "ordinal_text":
      switch (place) {
        case 1:
          return "Primer";
        case 2:
          return "Segundo";
        case 3:
          return "Tercer";
        default:
          return String(place);
      }
    case "medal":
      switch (place) {
        case 1:
          return "Oro";
        case 2:
          return "Plata";
        case 3:
          return "Bronce";
        default:
          return String(place);
      }
    case "other":
      return String(place);
  }
}

export function formatResultType(eventId: EventId): string {
  switch (eventId) {
    case "333bf":
    case "444bf":
    case "555bf":
      return "un mejor tiempo";
    case "333mbf":
    case "333fm":
      return "un mejor resultado";
    case "666":
    case "777":
      return "una media";
    default:
      return "un promedio";
  }
}

export function formatDates(startDate: Date, endDate: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "2-digit",
  };

  // Check if both dates are the same day
  if (startDate.toDateString() === endDate.toDateString()) {
    return startDate.toLocaleDateString("es-ES", options);
  }

  // If in the same month and year, build a list of day numbers and then add month/year
  if (
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth()
  ) {
    const days: number[] = [];
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();

    for (let day = startDay; day <= endDay; day++) {
      days.push(day);
    }

    let daysString: string;
    if (days.length === 2) {
      daysString = `${days[0]} y ${days[1]}`;
    } else {
      // Join all but the last with comma and add " y " before the last day
      daysString = `${days.slice(0, -1).join(", ")} y ${days[days.length - 1]}`;
    }

    const month = startDate.toLocaleDateString("es-ES", { month: "long" });
    const year = startDate.getFullYear();
    return `${daysString} de ${month} de ${year}`;
  }

  // Fallback: return original range formatting
  const startDateFormatted = startDate.toLocaleDateString("es-ES", options);
  const endDateFormatted = endDate.toLocaleDateString("es-ES", options);
  return `${startDateFormatted} - ${endDateFormatted}`;
}

export function joinPersons(persons: string[]): string {
  const personsCopy = [...persons];

  if (personsCopy.length === 1) {
    return personsCopy[0] ?? "";
  }

  const lastPerson = personsCopy.pop();
  return `${personsCopy.join(", ")} ${lastPerson?.startsWith("I") ? "e" : "y"} ${lastPerson}`;
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {},
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate"
      ? (accurateSizes[i] ?? "Bytest")
      : (sizes[i] ?? "Bytes")
  }`;
}

export function generateFakeResult(ranking: number): Result {
  return {
    personId: faker.number.int({ min: 1, max: 3 }),
    ranking,
    attempts: Array.from({ length: 5 }, () =>
      faker.number.int({ min: 500, max: 10000 }),
    ),
    best: faker.number.int({ min: 500, max: 1000 }),
    average: faker.number.int({ min: 500, max: 10000 }),
  };
}

export function generateFakeResultsForRound(round: Round): Round {
  const rankings = [1, 2, 3];
  const results = rankings.map((ranking) => generateFakeResult(ranking));
  return { ...round, results };
}

export function generateFakeResultsForEvent(event: Event): Event {
  const rounds = event.rounds.map(generateFakeResultsForRound);
  return { ...event, rounds };
}

export function generateFakeResultsForAllEvents(events: Event[]): Event[] {
  return events.map(generateFakeResultsForEvent);
}
