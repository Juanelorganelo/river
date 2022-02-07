/**
 * Copyright (c) Juan Manuel Garcia Junco Moreno.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import code from "cli-highlight";
import chalk from "chalk";
import fromUnixTime from "date-fns/fromUnixTime";
import { CloudWatchLogsClient, FilteredLogEvent, paginateFilterLogEvents } from "@aws-sdk/client-cloudwatch-logs";
import { formatShortDate } from "./dates";

const FILTER_LOG_EVENTS_PAGE_SIZE = 500;

/**
 * A CloudWatch log event with the exception that
 * the Log type replaces the "message" property with "record".
 */
export type Log = Omit<FilteredLogEvent, "message"> & { record: any };

/**
 * Available options passed to the printLogEvents function.
 */
export interface PrintLogEventsOptions {
  /**
   * Number of spaces used to indent JSON records.
   */
  indent?: number;
}

/**
 * Print log events to the console.
 *
 * @param events The list of events to print.
 * @param options Print options.
 */
export function printLogEvents(events: Log[], options?: PrintLogEventsOptions): void {
  for (const event of events) {
    process.stdout.write(formatLogEvent(event, options?.indent));
  }
}

/**
 * Options passed to the paginateLogEvents generator function.
 */
export interface PaginateLogEventsOptions {
  /**
   * The URL to the AWS endpoint to use.
   */
  endpointURL?: string;
  /**
   * The end of the date range to get logs from.
   */
  stop?: Date;
  /**
   * The start of the date range to get logs from.
   */
  start?: Date;
  /**
   * A list of log stream names used to filter logs. If provided, only logs from the stream list will be fetched.
   */
  logStreamNames?: string[];
  /**
   * Similar to logStreamNames if provided, will only return logs from log streams matching the given prefix.
   */
  logStreamNamePrefix?: string;
}

/**
 * An async generator function that will return a page of log events from CloudWatch.
 *
 * @param logGroup The name of the CloudWatch log group.
 * @param options Pagination and filtering options.
 */
export async function* paginateLogEvents(logGroup: string, options?: PaginateLogEventsOptions): AsyncGenerator<Log[]> {
  const client = new CloudWatchLogsClient({
    endpoint: options?.endpointURL,
    maxAttempts: 3,
  });
  const logEventPaginator = paginateFilterLogEvents(
    {
      client,
      pageSize: FILTER_LOG_EVENTS_PAGE_SIZE,
    },
    {
      endTime: options?.stop?.getTime(),
      startTime: options?.start?.getTime(),
      interleaved: true,
      logGroupName: logGroup,
      logStreamNames: options?.logStreamNames,
      logStreamNamePrefix: options?.logStreamNamePrefix,
    }
  );

  for await (const logEventPage of logEventPaginator) {
    const logs: Log[] = [];

    if (logEventPage.events) {
      for (const logEvent of logEventPage.events) {
        if (logEvent.message) {
          logs.push(swapProperty(logEvent, "message", "record", safeJSONParse));
        }
      }

      yield logs;
    }
  }
}

function swapProperty<T extends Record<string, unknown>, K extends keyof T, V extends string, U>(
  value: T,
  prev: K,
  next: V,
  mapper: (value: T[K]) => U
): Omit<T, K> & { [key in V]: U } {
  const current = value[prev];
  (value as any)[next] = mapper(current);
  delete value[prev];
  return value as any;
}

function safeJSONParse(json: string | undefined): unknown {
  try {
    return JSON.parse(json!);
  } catch (error) {
    return json;
  }
}

function formatRecord(event: Log, indent?: number): string {
  const json = JSON.stringify(event.record, null, indent);
  return code(json, { language: "json" });
}

function formatLogEvent(event: Log, indent?: number): string {
  return `[${formatTimestamp(event)}]: ${formatLogStreamName(event)}: ${formatRecord(event, indent)}\n`;
}

function formatTimestamp(event: Log): string {
  return chalk.green(formatShortDate(fromUnixTime(event.timestamp!)));
}

function formatLogStreamName(event: Log): string {
  return chalk.magenta(event.logStreamName);
}
