import { getUnixTime, setHours, setMinutes, setSeconds, startOfDay } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

export function getNextEpoch(dayFn: (date: Date) => Date, tz: string, hour: number, minute: number) {
  const today = startOfDay(toZonedTime(new Date(), tz));
  const targetDay = dayFn(today);
  const targetTime = setSeconds(setMinutes(setHours(targetDay, hour), minute), 0);
  return getUnixTime(fromZonedTime(targetTime, tz)).toString();
}
