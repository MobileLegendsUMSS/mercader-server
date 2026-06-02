export function toBoliviaTime(date: string) {
  const newDate = new Date(date);
  const boliviaDate = new Date(newDate.getTime() + (4 * 60 * 60 * 1000));
  return boliviaDate;
}

export function yearToDate(year: string) {
  const newDate = new Date(year + "-01-01T00:00:00.000Z");
  return newDate;
}

export function monthToDate(month: string) {
  const newDate = new Date(month + "-01T00:00:00.000Z");
  return newDate;
}