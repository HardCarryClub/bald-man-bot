import { getUnixTime, isAfter, setHours, setMinutes, setSeconds, startOfDay } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

export function thisOrNext(
  dayCheck: (date: Date) => boolean,
  nextFn: (date: Date) => Date,
  tz: string,
  hour: number,
  minute: number,
) {
  const now = new Date();
  const zonedNow = new Date(now.toLocaleString("en-US", { timeZone: tz }));
  const candidate = new Date(zonedNow);
  candidate.setHours(hour, minute, 0, 0);
  if (dayCheck(zonedNow) && isAfter(candidate, zonedNow)) {
    return getNextEpoch((d) => d, tz, hour, minute);
  } else {
    return getNextEpoch(nextFn, tz, hour, minute);
  }
}

export function getNextEpoch(dayFn: (date: Date) => Date, tz: string, hour: number, minute: number) {
  const today = startOfDay(toZonedTime(new Date(), tz));
  const targetDay = dayFn(today);
  const targetTime = setSeconds(setMinutes(setHours(targetDay, hour), minute), 0);
  return getUnixTime(fromZonedTime(targetTime, tz)).toString();
}
