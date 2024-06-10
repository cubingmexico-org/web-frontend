/* eslint-disable @typescript-eslint/explicit-function-return-type -- . */
import type { Event, Person, Result, EventId } from '@/types/wca-live';

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
      .filter((result: Result) => result.ranking !== null && result.ranking >= 1 && result.ranking <= 3)
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

export function transformString(s: string, caseType?: 'lowercase' | 'capitalize' | 'uppercase'): string {
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

export function formatResults(result: number, eventId: EventId): string {

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
    const time = `${solved}/${attempted} en ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    return time;
  }

  if (result === -1) {
    return 'DNF';
  }

  if (result === -2) {
    return 'DNS';
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

export function formatEvents(eventId: EventId, mode?: 'en' | 'es') {
  switch (mode) {
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

// TODO: Add "lugar"

export function formatPlace(place: number, formatType: 'place' | 'medal' | 'other'): string {
  switch (formatType) {
    case 'place':
      switch (place) {
        case 1:
          return 'Primer Lugar';
        case 2:
          return 'Segundo Lugar';
        case 3:
          return 'Tercer Lugar';
        default:
          return String(place);
      }
    case 'medal':
      switch (place) {
        case 1:
          return 'Oro';
        case 2:
          return 'Plata';
        case 3:
          return 'Bronce';
        default:
          return String(place);
      }
    case 'other':
      return String(place);
  }
}

export function formatResultType(eventId: EventId): string {
  switch (eventId) {
    case '333bf':
    case '444bf':
    case '555bf':
      return 'un mejor tiempo';
    case '333mbf':
    case '333fm':
      return 'un mejor resultado';
    case '666':
    case '777':
      return 'una media';
    default:
      return 'un promedio';
  }
}

export function formatDates(date: string, days: string): string {
  const daysNumber = Number(days);
  const [year, month, day] = date.split('-');
  const startDate = new Date(Number(year), Number(month) - 1, Number(day));
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };

  const dates = [];
  for (let i = 0; i < daysNumber; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    dates.push(new Intl.DateTimeFormat('es-ES', options).format(currentDate).split(' ')[0]);
  }

  const lastDate = dates.pop();
  const monthYear = new Intl.DateTimeFormat('es-ES', options).format(startDate).split(' ').slice(1).join(' ');

  if (daysNumber === 1) {
    // eslint-disable-next-line @typescript-eslint/no-shadow -- This is a different variable
    const day = new Intl.DateTimeFormat('es-ES', { day: 'numeric' }).format(startDate);
    return `${day} ${monthYear}`;
  } return `${dates.join(', ')} y ${lastDate} ${monthYear}`;
}

export function joinPersons(persons: string[]): string {
  const personsCopy = [...persons];

  if (personsCopy.length === 1) {
    return personsCopy[0];
  }

  const lastPerson = personsCopy.pop();
  return `${personsCopy.join(', ')} y ${lastPerson}`;
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