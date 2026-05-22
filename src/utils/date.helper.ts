export function toBoliviaTime(date: string) {
  const newDate = new Date(date);
  const boliviaDate = new Date(newDate.getTime() + (4 * 60 * 60 * 1000));
  return boliviaDate;
}