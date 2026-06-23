import type { PaginatedRequestParams } from "../paginatedRequestParams.ts";
import { toDateString } from "../../util/dateUtils.ts";

/**
 * Represents the query parameters for a request to get a list of averages.
 */
export type GetAveragesParams = PaginatedRequestParams & {
   /** *Optional* Minimum (oldest) date inclusive. Accepts a `Date` object or a `YYYY-MM-DD` string. */
   dateMin?: Date | string;

   /** *Optional* Maximum (most recent) date inclusive. Accepts a `Date` object or a `YYYY-MM-DD` string. */
   dateMax?: Date | string;

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
   if (parameters?.dateMin) url.searchParams.append("date_min", toDateString(parameters.dateMin));
   if (parameters?.dateMax) url.searchParams.append("date_max", toDateString(parameters.dateMax));
   if (parameters?.groups) url.searchParams.append("groups", parameters.groups.join(","));
   if (parameters?.attributes) url.searchParams.append("attributes", parameters.attributes.join(","));
   if (parameters?.includeHistorical) url.searchParams.append("include_historical", "1");

   return new Request(url.toString());
}
