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
    "enero", "febrero", "marzo", "abril", "mayo",
    "junio", "julio", "agosto", "septiembre", "octubre",
    "noviembre", "diciembre"
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
