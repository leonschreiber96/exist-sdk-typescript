import type { PaginatedRequestParams } from "../paginatedRequestParams.ts";

/**
 * Represents the query parameters for a request to get a list of averages.
 */
export type GetAveragesParams = PaginatedRequestParams & {
   /** *Optional* `yyyy-mm-dd`formatted date string defining the minimum (oldest) date inclusive. */
   dateMin?: Date;

   /** *Optional* `yyyy-mm-dd`formatted date string defining the maximum (most recent) date inclusive. */
   dateMax?: Date;

   /** *Optional* List of groups to filter by, e.g. `['activity', 'workouts']`. */
   groups?: string[];

   /** *Optional* List of attributes to filter by. */
   attributes?: string[];

   /** *Optional* Boolean flag, set `true` to receive historical records also. */
   includeHistorical?: boolean;
};

/**
 * Returns a request object with a GET request that retrieves a user's pre-calculated averages (see https://developer.exist.io/reference/averages/).
 * @param baseUrl - The base URL for the REST API.
 * @param [parameters] - *Optional* The query parameters to include in the request.
 *
 * @returns A request object with a GET request for the `/attributes/` endpoint and the specified query parameters.
 */
export function getAveragesRequest(baseUrl: string, parameters?: GetAveragesParams): Request {
   const url = new URL(`${baseUrl}/averages/`);

   if (parameters?.page) url.searchParams.append("page", parameters.page.toString());
   if (parameters?.limit) url.searchParams.append("limit", parameters.limit.toString());
   if (parameters?.dateMin) url.searchParams.append("date_min", parameters.dateMin.toISOString());
   if (parameters?.dateMax) url.searchParams.append("date_max", parameters.dateMax.toISOString());
   if (parameters?.groups) url.searchParams.append("groups", parameters.groups.join(","));
   if (parameters?.attributes) url.searchParams.append("attributes", parameters.attributes.join(","));
   if (parameters?.includeHistorical) url.searchParams.append("include_historical", "1");

   return new Request(url.toString());
}
