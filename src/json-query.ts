/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/**
 * Copyright (c) Juan Manuel Garcia Junco Moreno.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import jp from "jsonpath";

import type { Log } from "./logs";
import type { PathSegment, QueryStatement } from "jsonpath";

/**
 * Run a JSONPath query against a list of log events.
 *
 * @param events The list of log events.
 * @param expression The JSONPath query.
 * @return The filtered list of log events.
 */
export function query(events: Log[], expression: string): Log[] {
  validate(expression);

  const logs: Log[] = [];

  for (const node of jp.nodes(events, expression)) {
    // Get the first two values of the path.
    // First value is always the root element (i.e. the array of log events)
    // and the second value will be an array subscript since we ensure that
    // no child member identifiers are added to the root element on the `validate` function.
    const path = node.path.slice(0, 2);
    const [event] = jp.query<Log[], Log>(events, jp.stringify(path));

    // Copy the event but replace the original record with the value returned by the query.
    logs.push({
      ...event,
      record: node.value === event ? (node.value as any).record : node.value,
    });
  }

  return logs;
}

const LOG_EVENT_IDENTIFIERS = ["record", "eventId", "timestamp", "ingestionTime", "logStreamName"];

function validate(query: string): void | never {
  const [, firstNode, secondNode] = jp.parse(query);

  if (firstNode) {
    // Disallow child member operator since the query will ran on the log
    // events list which is an array.
    if (isChildMemberOperation(firstNode)) {
      throw new Error(
        `Invalid JSONPath query \`${query}\`. Child member operator is disallowed on root object since \`$\` represents an array hence, it'll always return null`
      );
    }

    // If the expression after the subscript operator is a child member
    // operator, ensure that the identifier is for one of the properties on log events.
    if (secondNode && isSubscriptOperation(firstNode) && isChildMemberOperation(secondNode)) {
      const identifier = getChildMemberIdentifier(secondNode);

      if (typeof identifier === "number" || !LOG_EVENT_IDENTIFIERS.includes(identifier)) {
        throw new Error(
          `Invalid identifier \`${identifier}\` on child member operator. Available identifiers on log events are ${LOG_EVENT_IDENTIFIERS.join(
            ", "
          )}`
        );
      }
    }
  }
}

function isSubscriptOperation(token: QueryStatement): boolean {
  return token.operation === "subscript";
}

function isChildMemberOperation(token: QueryStatement): boolean {
  return token.operation === "member" && token.scope === "child";
}

function getChildMemberIdentifier(token: QueryStatement): PathSegment {
  return token.expression.value;
}
