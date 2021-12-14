/**
 * Copyright (c) Juan Manuel Garcia Junco Moreno.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import parse from "date-fns/parse";
import format from "date-fns-tz/format";
import { toTimeZone } from "./time-zone";

const SHORT_DATE_FORMAT = "dd/MM/yyyy HH:mm";

/**
 * Parse a date in short format (i.e. dd/MM/yyyy HH:mm).
 *
 * @param shortDate The short date string.
 * @param timeZone The time zone of the returned date. Defaults to the system time zone.
 * @return The parsed Date instance.
 */
export function parseShortDate(shortDate: string, timeZone?: string): Date {
  const parsed = parse(shortDate, SHORT_DATE_FORMAT, new Date());
  return timeZone ? toTimeZone(parsed, { to: timeZone }) : parsed;
}

/**
 * Format a date into short format.
 *
 * @param date The Date instance.
 * @param timeZone The time zone of the date. Defaults to the system time zone.
 * @return The parsed Date instance.
 */
export function formatShortDate(date: Date, timeZone?: string): string {
  return format(date, SHORT_DATE_FORMAT, { timeZone });
}
