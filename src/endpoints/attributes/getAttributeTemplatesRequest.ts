import type { PaginatedRequestParams } from "../paginatedRequestParams.ts";

/**
 * Represents the query parameters for a request to get a list of attribute templates.
 */
export type GetAttributeTemplatesParams = PaginatedRequestParams & {
   /** *Optional* Boolean flag, set to `true` to include attributes with a priority >= 10 */
   includeLowPriority?: boolean;

   /** *Optional* List of groups to filter by, e.g. `['activity', 'workouts']` */
   groups?: string[];
};

/**
 * Returns a request object with a GET request that retrieves a user's attribute templates (see https://developer.exist.io/reference/attributes/#get-attribute-templates).
 * @param baseUrl - The base URL for the REST API.
 * @param [parameters] - *Optional* The query parameters to include in the request.
 *
 * @returns A request object with a GET request for the `/attributes/templates` endpoint and the specified query parameters.
 */
export function getAttributeTemplatesRequest(baseUrl: string, parameters?: GetAttributeTemplatesParams): Request {
   const url = new URL(`${baseUrl}/attributes/templates/`);

   if (parameters?.page) url.searchParams.append("page", parameters.page.toString());
   if (parameters?.limit) url.searchParams.append("limit", parameters.limit.toString());
   if (parameters?.includeLowPriority) url.searchParams.append("include_low_priority", "1");
   if (parameters?.groups) url.searchParams.append("groups", parameters.groups.join(","));

   return new Request(url.toString());
}
