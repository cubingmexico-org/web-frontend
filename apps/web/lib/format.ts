export function formatDate(
  date: Date | string | number | undefined,
  opts: Intl.DateTimeFormatOptions = {},
) {
  if (!date) return "";

  try {
    return new Intl.DateTimeFormat("es-MX", {
      month: opts.month ?? "long",
      day: opts.day ?? "numeric",
      year: opts.year ?? "numeric",
      timeZone: opts.timeZone ?? "UTC",
      ...opts,
    }).format(new Date(date));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_err) {
    return "";
  }
}
