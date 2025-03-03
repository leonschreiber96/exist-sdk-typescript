/**
 * Returns a request object with a GET request that retrieves the authenticated user's profile information (see https://developer.exist.io/reference/users/#get-all-insights).
 * @param baseUrl - The base URL for the REST API.
 *
 * @returns A request object with a GET request for the `/accounts/profile/` endpoint and the specified query parameters.
 */
export function getUserProfileRequest(baseUrl: string): Request {
   const url = `${baseUrl}/profile/`;
   return new Request(url, { method: "GET" });
}
