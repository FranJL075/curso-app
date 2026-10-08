export function formatCourseDate(value) {
  if (!value) return "";

  const dateString = value instanceof Date
    ? value.toISOString().slice(0, 10)
    : String(value).slice(0, 10);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString);
  if (!match) return String(value);

  const [, year, month, day] = match.map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return String(value);
  }

  return new Intl.DateTimeFormat("es-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(date);
}
