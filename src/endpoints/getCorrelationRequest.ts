/**
 * Returns a request object with a GET request that retrieves a correlation for a certain pair of attributes (see https://developer.exist.io/reference/correlations/#find-a-specific-correlation-combination).
 * @param baseUrl - The base URL for the REST API.
 * @param [parameters] - *Optional* The query parameters to include in the request.
 *
 * @returns A request object with a GET request for the `/correlations/combo/` endpoint and the specified query parameters.
 */
export function getCorrelationRequest(baseUrl: string, attributes: [string, string]): Request {
   const url = new URL(`${baseUrl}/correlations/combo/`);

   url.searchParams.append("attribute", attributes[0]);
   url.searchParams.append("attribute2", attributes[1]);

   return new Request(url.toString());
}
