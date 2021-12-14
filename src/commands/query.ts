/**
 * Query logs on CloudWatch.
 * @author Juan Manuel Garcia Junco Moreno
 * @copyright Juanelorganelo. All rights reserved
 */
import startOfDay from "date-fns/startOfDay";
import { Command, flags } from "@oclif/command";
import { query } from "../json-query";
import { toTimeZone } from "../time-zone";
import { parseShortDate } from "../dates";
import { paginateLogEvents, printLogEvents } from "../logs";
import { load } from "../config";

function getZonedDate(date: Date, timeZone?: string): Date {
  if (timeZone) {
    return toTimeZone(date, { to: timeZone });
  }
  return date;
}

/**
 * Command to query logs from CloudWatch optionally filtered by a JSONPath query.
 */
export default class QueryCommand extends Command {
  public static args = [
    {
      name: "logGroupName",
      required: true,
      description: "The name of the log group to query",
    },
  ];

  public static flags = {
    to: flags.string({
      description: "End of date range to get logs from",
    }),
    from: flags.string({
      description: "Start of date range to get logs from",
    }),
    query: flags.string({
      description:
        "A JSONPath query ran against the log events list. Queries are run on log pages, so if you do something like $[1].record it'll give you the first record on every log page, not the first record overall",
    }),
    indent: flags.integer({
      description: "Number of spaces used to indent output for JSON logs",
    }),
    timeZone: flags.string({
      description:
        "Optional time zone. Logs will be filtered using this time zone if to or from are provided in addition to dates being printed in the specified time zone",
    }),
    endpointURL: flags.string({
      description:
        "A custom endpoint passed to the AWS SDK. This allows the SDK to get resources from other AWS-compatible APIs e.g. LocalStack",
    }),
    logStreamNames: flags.string({
      multiple: true,
      description: "Names of log streams to get logs from",
    }),
    logStreamNamePrefix: flags.string({
      description: "A prefix used to filter logs. Only logs from a log stream matching the prefix will be returned",
    }),
  };

  public static description = "Query a batch of logs from CloudWatch";

  public async run() {
    const { flags, args } = this.parse(QueryCommand);

    const config = await load(flags);

    const stop = config.to ? parseShortDate(config.to, config.timeZone) : getZonedDate(new Date(), config.timeZone);
    const start = config.from ? parseShortDate(config.from, config.timeZone) : getZonedDate(startOfDay(new Date()), config.timeZone);

    const logsPaginator = paginateLogEvents(args.logGroupName, {
      endpointURL: config.endpointURL,
      stop,
      start,
      logStreamNames: config.logStreamNames,
      logStreamNamePrefix: config.logStreamNamePrefix,
    });

    try {
      for await (const logsPage of logsPaginator) {
        if (config.query) {
          const result = query(logsPage, config.query);
          printLogEvents(result, { indent: config.indent });
        } else {
          printLogEvents(logsPage, { indent: config.indent });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
