export type GetInsightsParams = {
   /** Number of values to return per page. *Optional*, max is `100`. */
   page?: number;

   /** Page index. *Optional*, default is `1`. */
   limit?: number;

   /** Oldest date (inclusive) of results to be returned, in format YYYY-mm-dd. Optional. */
   date_min?: string;

   /** Most recent date (inclusive) of results to be returned, in format `YYYY-mm-dd`. *Optional*. */
   date_max?: string;

   /** Filter by insight priority, where `1` = today and `4` = last month. *Optional*. */
   priority?: number;
};

export function getInsightsRequest(baseUrl: string, parameters?: GetInsightsParams) {
   const url = new URL(`${baseUrl}/insights/`);

   if (parameters?.page) url.searchParams.append("page", parameters.page.toString());
   if (parameters?.limit) url.searchParams.append("limit", parameters.limit.toString());
   if (parameters?.date_min) url.searchParams.append("date_min", parameters.date_min);
   if (parameters?.date_max) url.searchParams.append("date_max", parameters.date_max);
   if (parameters?.priority) url.searchParams.append("priority", parameters.priority.toString());

   return new Request(url.toString());
}
