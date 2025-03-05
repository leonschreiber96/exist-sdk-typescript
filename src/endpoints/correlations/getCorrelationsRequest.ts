import type { PaginatedRequestParams } from "../paginatedRequestParams.ts";

export type GetCorrelationsParams = PaginatedRequestParams & {
   /** *Optional* Boolean flag, set to `true` to return only correlations above a certain relationship strength. */
   strong?: boolean;

   /** *Optional* Boolean flag, set to `1` to return only correlations with a five-star confidence. */
   confident?: boolean;

   /** *Optional* Pass the name of an attribute to filter correlations to this attribute only. */
   attribute?: string;
};

/**
 * Returns a request object with a GET request that retrieves a user's precomputed correlations (see https://developer.exist.io/reference/correlations/).
 * @param baseUrl - The base URL for the REST API.
 * @param [parameters] - *Optional* The query parameters to include in the request.
 *
 * @returns A request object with a GET request for the `/correlations/` endpoint and the specified query parameters.
 */
export function getCorrelationsRequest(baseUrl: string, parameters?: GetCorrelationsParams): Request {
   const url = new URL(`${baseUrl}/correlations/`);

   if (parameters?.page) url.searchParams.append("page", parameters.page.toString());
   if (parameters?.limit) url.searchParams.append("limit", parameters.limit.toString());
   if (parameters?.strong) url.searchParams.append("strong", "1");
   if (parameters?.confident) url.searchParams.append("confident", "1");
   if (parameters?.attribute) url.searchParams.append("attribute", parameters.attribute);

   return new Request(url.toString());
}
