export function getUserProfileRequest(baseUrl: string): Request {
   const url = `${baseUrl}/profile/`;
   return new Request(url, { method: "GET" });
}
