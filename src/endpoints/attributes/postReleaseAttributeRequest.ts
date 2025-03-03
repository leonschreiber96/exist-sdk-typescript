/**
 * Returns a request object with a GET request that releases a previously acquired attribute (seehttps://developer.exist.io/reference/attribute_ownership/#release-attributes).
 * @param baseUrl - The base URL for the REST API.
 *
 * @returns A request object with a GET request for the `/attributes/release/` endpoint and the specified query parameters.
 */
export function releaseAttributeRequest(baseUrl: string, ...attributes: string[]): Request {
   const url = `${baseUrl}/attributes/release/`;
   return new Request(url, { method: "POST" });
}
