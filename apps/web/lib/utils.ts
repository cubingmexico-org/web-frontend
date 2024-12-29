export function formatTime(centiseconds: number): string {
  const seconds = centiseconds / 100;
  if (seconds < 60) {
    return seconds.toFixed(2);
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = (seconds % 60).toFixed(2);
  return `${minutes}:${remainingSeconds}`;
}

export function formatCompetitionDateSpanish(competition: {
  day: number;
  month: number;
  year: number;
  endDay: number;
  endMonth: number;
}): string {
  const spanishMonthNames = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  const startDay = competition.day;
  const startMonth = competition.month;
  const endDay = competition.endDay;
  const endMonth = competition.endMonth;

  let formattedDate: string;

  if (endDay && endMonth && (startDay !== endDay || startMonth !== endMonth)) {
    if (startMonth === endMonth) {
      if (endDay - startDay === 1) {
        formattedDate = `${startDay} y ${endDay} de ${spanishMonthNames[startMonth - 1]} de ${competition.year}`;
      } else {
        formattedDate = `${startDay} al ${endDay} de ${spanishMonthNames[startMonth - 1]} de ${competition.year}`;
      }
    } else {
      formattedDate = `${startDay} de ${spanishMonthNames[startMonth - 1]} al ${endDay} de ${spanishMonthNames[endMonth - 1]} de ${competition.year}`;
    }
  } else {
    formattedDate = `${startDay} de ${spanishMonthNames[startMonth - 1]} de ${competition.year}`;
  }

  return formattedDate;
}

export function formatDate(
  date: Date | string | number,
  opts: Intl.DateTimeFormatOptions = {}
) {
  return new Intl.DateTimeFormat("en-US", {
    month: opts.month ?? "long",
    day: opts.day ?? "numeric",
    year: opts.year ?? "numeric",
    ...opts,
  }).format(new Date(date))
}

export function toSentenceCase(str: string) {
  return str
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase())
    .replace(/\s+/g, " ")
    .trim()
}

/**
 * @see https://github.com/radix-ui/primitives/blob/main/packages/core/primitive/src/primitive.tsx
 */
export function composeEventHandlers<E>(
  originalEventHandler?: (event: E) => void,
  ourEventHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {}
) {
  return function handleEvent(event: E) {
    originalEventHandler?.(event)

    if (
      checkForDefaultPrevented === false ||
      !(event as unknown as Event).defaultPrevented
    ) {
      return ourEventHandler?.(event)
    }
  }
}