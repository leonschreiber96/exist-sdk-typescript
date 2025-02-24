import { PaginatedRequestParams } from "./_paginatedRequestParams.ts";

/** URL parameters for a GET request to retrieve a user's attributes. */
export type GetAttributesParams = PaginatedRequestParams & {
   /** *Optional* Comma-separated list of groups to filter by, e.g. activity, workouts, ... */
   groups?: string[];

   /** *Optional* Comma-separated list of attributes to filter by. */
   attributes?: string[];

   /** *Optional* Boolean flag, set to `true` to only show templated attributes. */
   excludeCustom?: boolean;

   /** *Optional* Boolean flag, set to `true` to only show manual attributes or false to exclude. */
   manual?: boolean;

   /** *Optional* Boolean flag, set to `true` to include attributes with `active = false`, usually hidden. */
   includeInactive?: boolean;

   /** *Optional* Boolean flag, set to `true` to include attributes with `priority >= 10`. */
   includeLowPriority?: boolean;

   /** *Optional* Boolean flag, set to `true` to omit attributes not owned by this client. */
   owned?: boolean;
};

/**
 * Returns a request object with a GET request that retrieves a user's attributes (without values).
 * @param baseUrl - The base URL for the REST API.
 * @param [parameters] - *Optional* The query parameters to include in the request.
 *
 * @returns A request object with a GET request for the `/attributes/` endpoint and the specified query parameters.
 */
export function getAttributesRequest(baseUrl: string, parameters?: GetAttributesParams): Request {
   const url = new URL(`${baseUrl}/attributes/`);

   if (parameters?.page) url.searchParams.append("page", parameters.page.toString());
   if (parameters?.limit) url.searchParams.append("limit", parameters.limit.toString());
   if (parameters?.groups) url.searchParams.append("groups", parameters.groups.join(","));
   if (parameters?.attributes) url.searchParams.append("attributes", parameters.attributes.join(","));
   if (parameters?.excludeCustom) url.searchParams.append("exclude_custom", "1");
   if (parameters?.manual) url.searchParams.append("manual", "1");
   if (parameters?.includeInactive) url.searchParams.append("include_inactive", "1");
   if (parameters?.includeLowPriority) url.searchParams.append("include_low_priority", "1");
   if (parameters?.owned) url.searchParams.append("owned", "1");

   return new Request(url.toString());
}
