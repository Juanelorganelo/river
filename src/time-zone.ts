/**
 * Date utilities.
 * @author Juan Manuel Garcia Junco Moreno
 * @copyright CourseKey Inc. All rights reserved
 */
import zonedTimeToUtc from "date-fns-tz/zonedTimeToUtc";
import utcToZonedTime from "date-fns-tz/utcToZonedTime";

/**
 * Options for the `toTimeZone` function.
 */
export interface ToTimeZoneOptions {
  /**
   * Time zone to convert the date to.
   */
  to: string;
  /**
   * The current time zone of the date. Defaults to the system's time zone.
   */
  from?: string;
}

/**
 * Convert a Date from one timezone to a different timezone.
 * @param date The date to convert.
 * @param from The timezone the date is in.
 * @param to The timezone to convert the date to.
 * @return The converted date.
 */
export function toTimeZone(date: Date, options: ToTimeZoneOptions): Date {
  return utcToZonedTime(zonedTimeToUtc(date, options.from ?? getCurrentTimeZoneOffset()), options.to);
}

/**
 * Get's the offset for the current timezone.
 * @return The timezone offset.
 */
export function getCurrentTimeZoneOffset(): string {
  const offset = -new Date().getTimezoneOffset();
  const hours = Math.floor(offset / 60);
  const minutes = offset % 60;
  return `${offset >= 0 ? "+" : "-"}${getNumberOfDigits(hours) < 2 ? `0${Math.abs(hours)}` : Math.abs(hours)}:${
    getNumberOfDigits(minutes) < 2 ? `0${minutes}` : minutes
  }`;
}

function getNumberOfDigits(number: number): number {
  return String(Math.abs(number)).length;
}
