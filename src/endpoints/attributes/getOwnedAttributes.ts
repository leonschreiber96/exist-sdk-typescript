import type { PaginatedRequestParams } from "../paginatedRequestParams.ts";

/**
 * Represents the query parameters for a request to get a list of owned attributes.
 */
export type GetOwnedAttributesParams = PaginatedRequestParams & {
   /** *Optional* List of groups to filter by, e.g. `['activity', 'workouts']` */
   groups?: string[];

   /** *Optional* List of attributes to filter by */
   attributes?: string[];

   /** *Optional* Boolean flag, set to `true` to only show templated attributes */
   excludeCustom?: boolean;

   /** *Optional* Boolean flag, set to `true` to only show manual attributes or `false` to exclude */
   manual?: boolean;

   /** *Optional* Boolean flag, set to `true` to include attributes with `active = False`, usually hidden */
   includeInactive?: boolean;

   /** *Optional* Boolean flag, set to `true` to include attributes with a priority >= 10 */
   includeLowPriority?: boolean;
};

/**
 * Returns a request object with a GET request that retrieves a user's owned attributes (see https://developer.exist.io/reference/attributes/#get-attribute-templates).
 * @param baseUrl - The base URL for the REST API.
 * @param [parameters] - *Optional* The query parameters to include in the request.
 *
 * @returns A request object with a GET request for the `/attributes/owned` endpoint and the specified query parameters.
 */
export function getOwnedAttributesRequest(baseUrl: string, parameters?: GetOwnedAttributesParams): Request {
   const url = new URL(`${baseUrl}/attributes/owned/`);

   if (parameters?.page) url.searchParams.append("page", parameters.page.toString());
   if (parameters?.limit) url.searchParams.append("limit", parameters.limit.toString());
   if (parameters?.groups) url.searchParams.append("groups", parameters.groups.join(","));
   if (parameters?.attributes) url.searchParams.append("attributes", parameters.attributes.join(","));
   if (parameters?.excludeCustom) url.searchParams.append("exclude_custom", "true");
   if (parameters?.manual) url.searchParams.append("manual", "true");
   if (parameters?.includeInactive) url.searchParams.append("include_inactive", "true");
   if (parameters?.includeLowPriority) url.searchParams.append("include_low_priority", "true");

   return new Request(url.toString());
}
