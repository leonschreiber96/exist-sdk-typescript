import { PaginatedRequestParams } from "../paginatedRequestParams.ts";

export type GetAttributesWithValuesParams = PaginatedRequestParams & {
   /** *Optional* Integer defining how many day values to include in values, max `31`, default `1`. */
   days?: number;

   /** *Optional* `yyyy-mm-dd` formatted date string defining the maximum date in values. */
   dateMax?: Date;

   /** *Optional* List of groups to filter by, e.g. `['activity', 'workouts']`. */
   groups?: string[];

   /** *Optional* List of attributes to filter by. */
   attributes?: string[];

   /** *Optional* List of attribute templates to filter by. */
   templates?: string[];

   /** *Optional* Boolean flag, set to `true` to only show manual attributes. */
   manual?: boolean;
};

/**
 * Returns a request object with a GET request that retrieves a user's attributes **including** values (see https://developer.exist.io/reference/attributes/#get-attributes-with-values).
 * @param baseUrl - The base URL for the REST API.
 * @param [parameters] - *Optional* The query parameters to include in the request.
 *
 * @returns A request object with a GET request for the `/attributes/wit-values` endpoint and the specified query parameters.
 */
export function getAttributesWithValuesRequest(baseUrl: string, parameters?: GetAttributesWithValuesParams): Request {
   const url = new URL(`${baseUrl}/attributes/with-values/`);

   if (parameters?.page) url.searchParams.append("page", parameters.page.toString());
   if (parameters?.limit) url.searchParams.append("limit", parameters.limit.toString());
   if (parameters?.days) url.searchParams.append("days", parameters.days.toString());
   if (parameters?.dateMax) url.searchParams.append("date_max", parameters.dateMax.toISOString());
   if (parameters?.groups) url.searchParams.append("groups", parameters.groups.join(","));
   if (parameters?.attributes) url.searchParams.append("attributes", parameters.attributes.join(","));
   if (parameters?.templates) url.searchParams.append("templates", parameters.templates.join(","));
   if (parameters?.manual) url.searchParams.append("manual", "1");

   return new Request(url.toString());
}
