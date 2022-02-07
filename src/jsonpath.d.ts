/**
 * Copyright (c) Juan Manuel Garcia Junco Moreno.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
declare module "jsonpath" {
  /**
   * A JSON-compatible object (i.e. an hash table or array).
   */
  export type JSONObject = Record<string, unknown> | unknown[];

  /**
   * A segment in a JSONPath path.
   */
  export type PathSegment = string | number;

  /**
   * The QueryNode object returned by the jsonpath nodes function.
   */
  export interface QueryNode<R> {
    /**
     * The path to the matching JSON property.
     */
    path: PathSegment[];
    /**
     * Result of the JSONPath query.
     */
    value: R;
  }

  /**
   * A statement on the parsed query array.
   */
  export interface QueryStatement {
    /**
     * The operation's scope.
     */
    scope: "child" | "descendant";
    /**
     * The operation type.
     */
    operation: "member" | "subscript";
    /**
     * Expression details.
     */
    expression: QueryExpression;
  }

  /**
   * A parsed query expression.
   */
  export type QueryExpression = QueryRootExpression | QueryValueExpression;

  /**
   * Object representing a JSONPath expression.
   */
  export interface QueryValueExpression {
    /**
     * The expression type.
     */
    type: "root" | "identifier" | "filter_expression";
    /**
     * The expression value.
     */
    value: PathSegment;
  }

  /**
   * The expression for the root selector.
   */
  export interface QueryRootExpression {
    /**
     * The expression type (i.e. "root")
     */
    type: "root";
    /**
     * The expression value.
     */
    value: "$";
  }

  /**
   * Main JSONPath module API.
   */
  export interface JSONPath {
    /**
     * Parse the provided JSONPath expression into path components and their associated operations.
     *
     * @param query The JSONPath query.
     * @return The list of statements.
     */
    parse(query: string): QueryStatement[];
    /**
     * Find paths to elements in `json` matching `query`. Returns an array of element paths that satisfy the provided JSONPath expression. Each path is itself an array of keys representing the location within `json` of the matching element. Returns only first `count` paths if specified.
     *
     * @param json The JSON object to query.
     * @param query The JSONPath query string.
     * @return The path array.
     */
    paths<T extends JSONObject>(json: T, query: string): Array<string | number>;
    /**
     * Find elements in `json` matching `query`. Returns an array of elements that satisfy the provided JSONPath expression, or an empty array if none were matched. Returns only first `count` elements if specified.
     *
     * @param json The JSON object to query.
     * @param query The JSONPath query string.
     * @param count Number of elements to return. If not specified will retrun ALL matching elements.
     * @return The query result.
     */
    query<T extends JSONObject, R = unknown>(json: T, query: string, count?: number): R[];
    /**
     * Find elements and their corresponding paths in `json` matching `query`. Returns an array of node objects where each node has a path containing an array of keys representing the location within `json`, and a value pointing to the matched element. Returns only first `count` nodes if specified.
     *
     * @param json The JSON object to query.
     * @param query The JSONPath query string.
     * @param count Number of elements to return. If not specified will retrun ALL matching elements.
     * @return The list of query nodes.
     */
    nodes<T extends JSONObject, R = unknown>(json: T, query: string, count?: number): QueryNode<R>[];
    /**
     * Returns the value of the first element matching `query`.
     *
     * @param json The JSON object to query.
     * @param query The JSONPath query string.
     * @return The value of the matching property.
     */
    value<T extends JSONObject, R = unknown>(json: T, query: string): R;
    /**
     * Sets the value of the first element matching `query` and returns the new value.
     *
     * @param json The JSON object to query.
     * @param query The JSONPath query string.
     * @param newValue The new value of the matching element.
     * @return The value of the matching property.
     */
    value<T extends JSONObject, V>(json: T, query: string, newValue: V): V;
    /**
     * Runs the supplied function callback on each matching element, and replaces each matching element with the return value from the function. The function accepts the value of the matching element as its only parameter. Returns matching nodes with their updated values.
     *
     * @param json The JSON object to query.
     * @param query The JSONPath query string.
     * @param callback The transformation callback.
     * @return List of transformed query results
     */
    apply<T extends JSONObject, R, V = unknown>(json: T, query: string, callback: (value: V) => R): R[];
    /**
     * Returns a path expression in string form, given a path. The supplied path may either be a flat array of keys, as returned by jp.nodes for example, or may alternatively be a fully parsed path expression in the form of an array of path components as returned by jp.parse
     *
     * @param path The path expression.
     * @return The string form of the path expression.
     */
    stringify(path: PathSegment[]): string;
  }

  const jp: JSONPath;
  export default jp;
}
