/** URL parameters for any request that returns a paginated response. */
export type PaginatedRequestParams = {
   /** *Optional*. Page index for paginated REST response. Default is `1`. */
   page?: number;

   /** *Optional*. Number of values to return per page. Maximum is `100`. */
   limit?: number;
};
