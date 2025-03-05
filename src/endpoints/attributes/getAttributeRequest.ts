import type { PaginatedRequestParams } from "../paginatedRequestParams.ts";

/**
 * Represents the query parameters for a request to get a single attribute and its values.
 */
export type GetAttributeParams = PaginatedRequestParams & {
   /** *Optional* Most recent date (inclusive) of results to be returned, in format `YYYY-mm-dd`. */
   dateMax?: Date;
};

/**
 * Returns a request object with a GET request that retrieves a single attribute and its values (see https://developer.exist.io/reference/attributes/#get-a-specific-attribute).
 * @param baseUrl - The base URL for the REST API.
 * @param attribute - The name of the attribute to get values for.
 * @param [parameters] - *Optional* The query parameters to include in the request.
 *
 * @returns A request object with a GET request for the `/attributes/values/` endpoint and the specified query parameters.
 */
export function getAttributeRequest(baseUrl: string, attribute: string, parameters?: GetAttributeParams): Request {
   const url = new URL(`${baseUrl}/attributes/values/`);

   url.searchParams.append("attribute", attribute);
   if (parameters?.limit) url.searchParams.append("limit", parameters.limit.toString());
   if (parameters?.page) url.searchParams.append("page", parameters.page.toString());
   if (parameters?.dateMax) url.searchParams.append("date_max", parameters.dateMax.toISOString());

   return new Request(url.toString());
}
