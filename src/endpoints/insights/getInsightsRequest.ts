import type { PaginatedRequestParams } from "../paginatedRequestParams.ts";

/**
 * Represents the query parameters for a request to get a list of insights.
 */
export type GetInsightsParams = PaginatedRequestParams & {
   /** *Optional* Oldest date (inclusive) of results to be returned, in format `YYYY-mm-dd`. */
   dateMin?: string;

   /** *Optional* Most recent date (inclusive) of results to be returned, in format `YYYY-mm-dd`. */
   dateMax?: string;

   /** *Optional* Filter by insight priority, where `1` = today and `4` = last month. */
   priority?: number;
};

/**
 * Returns a request object with a GET request that retrieves a user's precomputed insights (see https://developer.exist.io/reference/insights/#get-all-insights).
 * @param baseUrl - The base URL for the REST API.
 * @param [parameters] - *Optional* The query parameters to include in the request.
 *
 * @returns A request object with a GET request for the `/insights/` endpoint and the specified query parameters.
 */
export function getInsightsRequest(baseUrl: string, parameters?: GetInsightsParams): Request {
   const url = new URL(`${baseUrl}/insights/`);

   if (parameters?.page) url.searchParams.append("page", parameters.page.toString());
   if (parameters?.limit) url.searchParams.append("limit", parameters.limit.toString());
   if (parameters?.dateMin) url.searchParams.append("date_min", parameters.dateMin);
   if (parameters?.dateMax) url.searchParams.append("date_max", parameters.dateMax);
   if (parameters?.priority) url.searchParams.append("priority", parameters.priority.toString());

   return new Request(url.toString());
}
