import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function processPersons(persons: any) {
  const getRole = (role: string) => (person: any) => person.roles.includes(role);
  const getName = (person: any) => person.name;

  const delegates = persons.filter(getRole('delegate')).map(getName);
  const organizers = persons.filter(getRole('organizer')).map(getName);

  const personIdToName: { [key: string]: string } = {};
  persons.forEach((person: any) => {
    personIdToName[person.registrantId] = person.name;
  });

  function getEventData(event: any) {
    const rounds = event.rounds;
    const results = rounds[rounds.length - 1].results
      .filter((result: any) => result.ranking >= 1 && result.ranking <= 3)
      .map((person: any) => ({
        personName: personIdToName[person.personId],
        result: event.id === '333bf' ? person.best : person.average,
      }));

    return results;
  }

  return {
    delegates,
    organizers,
    getEventData
  };
}

export function formatResults(value: number | string) {

  if (value === -1) {
    return 'DNF';
  }

  const number = Number(value) / 100;
  let time: string;

  if (number >= 60) {
    let minutes = Math.floor(number / 60);
    let seconds = number % 60;
    time = `${minutes}:${seconds < 10 ? '0' : ''}${seconds.toFixed(2)}`;
  } else {
    time = number.toFixed(2);
  }

  return time;
}

export function formatEvents(eventId: string) {
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
}

export function formatPlace(place: string) {
  switch (place) {
    case '1':
      return 'primer';
    case '2':
      return 'segundo';
    case '3':
      return 'tercer';
    default:
      return place;
  }
}

export function formatMedal(place: string) {
  switch (place) {
    case '1':
      return 'ORO';
    case '2':
      return 'PLATA';
    case '3':
      return 'BRONCE';
    default:
      return place;
  }
}

export function formatResultType(eventId: string) {
  switch (eventId) {
    case '333bf':
    case '444bf':
    case '555bf':
    case '333mbf':
      return 'un mejor tiempo';
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
  const options = { day: 'numeric', month: 'long', year: 'numeric' } as any;

  let dates = [];
  for (let i = 0; i < daysNumber; i++) {
    let currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    dates.push(new Intl.DateTimeFormat('es-ES', options).format(currentDate).split(' ')[0]);
  }

  const lastDate = dates.pop();
  const monthYear = new Intl.DateTimeFormat('es-ES', options).format(startDate).split(' ').slice(1).join(' ');

  if (daysNumber === 1) {
    const day = new Intl.DateTimeFormat('es-ES', { day: 'numeric' }).format(startDate);
    return `${day} ${monthYear}`;
  } else {
    return `${dates.join(', ')} y ${lastDate} ${monthYear}`;
  }
}