export function formatTime(centiseconds: number): string {
  const seconds = centiseconds / 100;
  if (seconds < 60) {
    return seconds.toFixed(2);
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = (seconds % 60).toFixed(2).padStart(5, "0");
  return `${minutes}:${remainingSeconds}`;
}

export function formatTime333mbf(value: number): string {
    const valueStr = value.toString();
    const DD = valueStr.slice(0, 2);
    const TTTTT = valueStr.slice(2, 7);
    const MM = valueStr.slice(7);

    const difference = 99 - parseInt(DD);
    const missed = parseInt(MM);
    const solved = difference + missed;
    const attempted = solved + missed;

    const TTTTTNum = parseInt(TTTTT);
    const minutes = Math.floor(TTTTTNum / 60);
    const seconds = TTTTTNum % 60;
    const time = `${solved}/${attempted} ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    return time;
}

export function formatDate(
  startDate: Date | string | number,
  endDate: Date | string | number,
  opts: Intl.DateTimeFormatOptions = {},
) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const formatter = new Intl.DateTimeFormat("es-MX", {
    month: opts.month ?? "short",
    day: opts.day ?? "numeric",
    year: opts.year ?? "numeric",
    ...opts,
  });

  if (start.getTime() === end.getTime()) {
    return formatter.format(start);
  }

  const sameMonth =
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear();
  const dayFormatter = new Intl.DateTimeFormat("es-MX", { day: "numeric" });
  const monthYearFormatter = new Intl.DateTimeFormat("es-MX", {
    month: "short",
    year: "numeric",
  });

  if (sameMonth) {
    const startDay = dayFormatter.format(start);
    const endDay = dayFormatter.format(end);
    const monthYear = monthYearFormatter.format(start);
    return `${startDay} - ${endDay} ${monthYear}`;
  } else {
    const startDayMonth = new Intl.DateTimeFormat("es-MX", {
      day: "numeric",
      month: "short",
    }).format(start);
    const endDayMonth = new Intl.DateTimeFormat("es-MX", {
      day: "numeric",
      month: "short",
    }).format(end);
    const year = new Intl.DateTimeFormat("es-MX", { year: "numeric" }).format(
      end,
    );
    return `${startDayMonth} - ${endDayMonth} ${year}`;
  }
}

export function toSentenceCase(str: string) {
  return str
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase())
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * @see https://github.com/radix-ui/primitives/blob/main/packages/core/primitive/src/primitive.tsx
 */
export function composeEventHandlers<E>(
  originalEventHandler?: (event: E) => void,
  ourEventHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {},
) {
  return function handleEvent(event: E) {
    originalEventHandler?.(event);

    if (
      checkForDefaultPrevented === false ||
      !(event as unknown as Event).defaultPrevented
    ) {
      return ourEventHandler?.(event);
    }
  };
}
