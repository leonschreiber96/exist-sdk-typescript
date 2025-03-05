/**
 * Represents the response from a successful request to release attributes.
 */
export type ReleaseAttributesResponse = {
   success: { name: string }[];
   error: { title: string; error_code: string; error: string }[];
};

/**
 * Returns a request object with a GET request that releases a previously acquired attribute (seehttps://developer.exist.io/reference/attribute_ownership/#release-attributes).
 * @param baseUrl - The base URL for the REST API.
 * @param attributes - The names of the attributes to release.
 *
 * @returns A request object with a GET request for the `/attributes/release/` endpoint and the specified query parameters.
 */
export function releaseAttributesRequest(baseUrl: string, ...attributes: string[]): Request {
   const url = `${baseUrl}/attributes/release/`;
   return new Request(url, {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(attributes),
   });
}
