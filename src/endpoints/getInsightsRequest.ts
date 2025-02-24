import { PaginatedRequestParams } from "./_paginatedRequestParams.ts";

export type GetInsightsParams = PaginatedRequestParams & {
   /** *Optional* Oldest date (inclusive) of results to be returned, in format `YYYY-mm-dd`. */
   date_min?: string;

   /** *Optional* Most recent date (inclusive) of results to be returned, in format `YYYY-mm-dd`. */
   date_max?: string;

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
export function getInsightsRequest(baseUrl: string, parameters?: GetInsightsParams) {
   const url = new URL(`${baseUrl}/insights/`);

   if (parameters?.page) url.searchParams.append("page", parameters.page.toString());
   if (parameters?.limit) url.searchParams.append("limit", parameters.limit.toString());
   if (parameters?.date_min) url.searchParams.append("date_min", parameters.date_min);
   if (parameters?.date_max) url.searchParams.append("date_max", parameters.date_max);
   if (parameters?.priority) url.searchParams.append("priority", parameters.priority.toString());

   return new Request(url.toString());
}
