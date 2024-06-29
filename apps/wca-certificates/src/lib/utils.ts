/* eslint-disable @typescript-eslint/no-shadow -- . */
/* eslint-disable no-case-declarations -- . */
/* eslint-disable @typescript-eslint/explicit-function-return-type -- . */
import { faker } from '@faker-js/faker';
import type { Event, Person, Result, EventId, Round } from '@/types/wca-live';
import type { Locale } from '@/i18n-config';

export function processPersons(persons: Person[]) {
  const getRole = (role: string) => (person: Person) => person.roles.includes(role);
  const getName = (person: Person) => person.name;

  const delegates = persons.filter(getRole('delegate')).map(getName);
  const organizers = persons.filter(getRole('organizer')).map(getName);

  const personIdToName: Record<string, string> = {};
  persons.forEach((person: Person) => {
    personIdToName[person.registrantId] = person.name;
  });

  function getEventData(event: Event) {
    const rounds = event.rounds;
    const results = rounds[rounds.length - 1].results
      .filter((result: Result) => result.ranking !== null && result.best !== -1 && result.best !== -2 && result.ranking >= 1 && result.ranking <= 3)
      .map((person) => ({
        personName: personIdToName[person.personId],
        result: event.id === '333bf' || event.id === '444bf' || event.id === '555bf' || event.id === '333mbf' ? person.best : person.average,
      }));

    return results;
  }

  return {
    delegates,
    organizers,
    getEventData
  };
}

export function transformString(s: string, caseType?: 'lowercase' | 'capitalize' | 'uppercase' | 'none'): string {
  if (typeof s !== 'string') return ''
  switch (caseType) {
    case 'lowercase':
      return s.toLowerCase();
    case 'capitalize':
      return s.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    case 'uppercase':
      return s.toUpperCase();
    default:
      return s;
  }
}

export function formatResults(result: number, eventId: EventId, lang?: Locale): string {

  if (result === -1) {
    return 'DNF';
  }

  if (result === -2) {
    return 'DNS';
  }

  if (eventId === '333mbf') {
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
    const time = lang === 'es' ? `${solved}/${attempted} en ${minutes}:${seconds < 10 ? '0' : ''}${seconds}` : `${solved}/${attempted} in ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    return time;
  }

  const number = result / 100;
  let time: string;

  if (number >= 60) {
    const minutes = Math.floor(number / 60);
    const seconds = number % 60;
    time = `${minutes}:${seconds < 10 ? '0' : ''}${seconds.toFixed(2)}`;
  } else {
    time = number.toFixed(2);
  }

  return time;
}

export function formatEvents(eventId: EventId, lang?: Locale) {
  switch (lang) {
    case 'es':
      switch (eventId) {
        case '333':
          return '3x3x3';
        case '222':
          return '2x2x2';
        case '444':
          return '4x4x4';
        case '555':
          return '5x5x5';
        case '666':
          return '6x6x6';
        case '777':
          return '7x7x7';
        case '333bf':
          return '3x3x3 A Ciegas';
        case '333fm':
          return '3x3x3 Menos Movimientos';
        case '333oh':
          return '3x3x3 A Una Mano';
        case 'clock':
          return 'Clock';
        case 'minx':
          return 'Megaminx';
        case 'pyram':
          return 'Pyraminx';
        case 'skewb':
          return 'Skewb';
        case 'sq1':
          return 'Square-1';
        case '444bf':
          return '4x4x4 A Ciegas';
        case '555bf':
          return '5x5x5 A Ciegas';
        case '333mbf':
          return '3x3x3 Múltiples A Ciegas';
        default:
          return eventId;
      }
    case 'en':
    default:
      switch (eventId) {
        case '333':
          return '3x3x3';
        case '222':
          return '2x2x2';
        case '444':
          return '4x4x4';
        case '555':
          return '5x5x5';
        case '666':
          return '6x6x6';
        case '777':
          return '7x7x7';
        case '333bf':
          return '3x3x3 Blindfolded';
        case '333fm':
          return '3x3x3 Fewest Moves';
        case '333oh':
          return '3x3x3 One-Handed';
        case 'clock':
          return 'Clock';
        case 'minx':
          return 'Megaminx';
        case 'pyram':
          return 'Pyraminx';
        case 'skewb':
          return 'Skewb';
        case 'sq1':
          return 'Square-1';
        case '444bf':
          return '4x4x4 Blindfolded';
        case '555bf':
          return '5x5x5 Blindfolded';
        case '333mbf':
          return '3x3x3 Multi-Blind';
        default:
          return eventId;
      }
  }
}

export function formatPlace(place: number, formatType: 'cardinal' | 'ordinal' | 'ordinal_text' | 'medal' | 'other', lang?: Locale): string {
  switch (formatType) {
    case 'cardinal':
      switch (place) {
        case 1:
          return '1';
        case 2:
          return '2';
        case 3:
          return '3';
        default:
          return String(place);
      }
    case 'ordinal':
      switch (place) {
        case 1:
          return lang === 'es' ? '1er' : '1st';
        case 2:
          return lang === 'es' ? '2do' : '2nd';
        case 3:
          return lang === 'es' ? '3er' : '3rd';
        default:
          return String(place);
      }
    case 'ordinal_text':
      switch (place) {
        case 1:
          return lang === 'es' ? 'Primer' : 'First';
        case 2:
          return lang === 'es' ? 'Segundo' : 'Second';
        case 3:
          return lang === 'es' ? 'Tercer' : 'Third';
        default:
          return String(place);
      }
    case 'medal':
      switch (place) {
        case 1:
          return lang === 'es' ? 'Oro' : 'Gold';
        case 2:
          return lang === 'es' ? 'Plata' : 'Silver';
        case 3:
          return lang === 'es' ? 'Bronce' : 'Bronze';
        default:
          return String(place);
      }
    case 'other':
      return String(place);
  }
}

export function formatResultType(eventId: EventId, lang?: Locale): string {
  switch (eventId) {
    case '333bf':
    case '444bf':
    case '555bf':
      return lang === 'es' ? 'un mejor tiempo' : 'a single';
    case '333mbf':
    case '333fm':
      return lang === 'es' ? 'un mejor resultado' : 'a single';
    case '666':
    case '777':
      return lang === 'es' ? 'una media' : 'a mean';
    default:
      return lang === 'es' ? 'un promedio' : 'an average';
  }
}

export function formatDates(date: string, days: string, lang?: Locale): string {
  switch (lang) {
    case 'es':
      const daysNumber = Number(days);
      const [year, month, day] = date.split('-');
      const startDate = new Date(Number(year), Number(month) - 1, Number(day));
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };

      const dates = [];
      for (let i = 0; i < daysNumber; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        dates.push(new Intl.DateTimeFormat(lang, options).format(currentDate).split(' ')[0]);
      }

      const lastDate = dates.pop();
      const monthYear = new Intl.DateTimeFormat(lang, options).format(startDate).split(' ').slice(1).join(' ');

      if (daysNumber === 1) {
        const day = new Intl.DateTimeFormat(lang, { day: 'numeric' }).format(startDate);
        return `${day} ${monthYear}`;
      } return `${dates.join(', ')} y ${lastDate} ${monthYear}`;
    case 'en':
    default:
      const startDate2 = new Date(date);
      const endDate = new Date(startDate2);
      endDate.setDate(startDate2.getDate() + Number(days) - 1);

      const month2 = startDate2.toLocaleString('default', { month: 'long' });
      const year2 = startDate2.getFullYear();
      const dayNumbers = [];

      for (let d = startDate2.getDate(); d <= endDate.getDate(); d++) {
        dayNumbers.push(d);
      }

      if (dayNumbers.length === 1) {
        return `${month2} ${dayNumbers[0]}, ${year2}`;
      } else if (dayNumbers.length === 2) {
        return `${month2} ${dayNumbers[0]} and ${dayNumbers[1]}, ${year2}`;
      }
      const lastDay = dayNumbers.pop();
      return `${month2} ${dayNumbers.join(', ')}, and ${lastDay}, ${year2}`;
  }

}

export function joinPersons(persons: string[], lang?: Locale): string {
  const personsCopy = [...persons];

  if (personsCopy.length === 1) {
    return personsCopy[0];
  }

  const lastPerson = personsCopy.pop();
  return lang === 'es' ? `${personsCopy.join(', ')} y ${lastPerson}` : `${personsCopy.join(', ')} and ${lastPerson}`;
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number
    sizeType?: "accurate" | "normal"
  } = {}
) {
  const { decimals = 0, sizeType = "normal" } = opts

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"]
  if (bytes === 0) return "0 Byte"
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${sizeType === "accurate" ? accurateSizes[i] ?? "Bytest" : sizes[i] ?? "Bytes"
    }`
}

export function generateFakeResult(ranking: number): Result {
  return {
    personId: faker.number.int({ min: 1, max: 3 }),
    ranking,
    attempts: Array.from({ length: 5 }, () => faker.number.int({ min: 500, max: 10000 })),
    best: faker.number.int({ min: 500, max: 1000 }),
    average: faker.number.int({ min: 500, max: 10000 }),
  };
}

export function generateFakeResultsForRound(round: Round): Round {
  const rankings = [1, 2, 3];
  const results = rankings.map(ranking => generateFakeResult(ranking));
  return { ...round, results };
}

export function generateFakeResultsForEvent(event: Event): Event {
  const rounds = event.rounds.map(generateFakeResultsForRound);
  return { ...event, rounds };
}

export function generateFakeResultsForAllEvents(events: Event[]): Event[] {
  return events.map(generateFakeResultsForEvent);
}