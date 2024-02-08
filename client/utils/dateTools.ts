import dateTool from "date-and-time";
/**
 * Returns a string representing the time difference between the given date and now. ex: 1m, 2h, 3d, Jan 1 20020
 * @param date
 * @return
 */
export function dateWhenFormat(date: Date) {
  const now = new Date();

  const dateDiff = dateTool.subtract(now, date);
  const minuteDiff = Math.floor(dateDiff.toMinutes());
  const hourDiff = Math.floor(dateDiff.toHours());
  const dayDiff = Math.floor(dateDiff.toDays());

  if (minuteDiff < 60) return minuteDiff + "m";
  if (hourDiff < 24) return hourDiff + "h";
  if (dayDiff < 6) return dayDiff + "d";
  if (dayDiff > 364) return dateTool.format(date, "MMM D, YYYY");
  if (dayDiff > 6) return dateTool.format(date, "MMM D");
}
