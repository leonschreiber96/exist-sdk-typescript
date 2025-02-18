export type GetAveragesParams = {
   page?: number;
   limit?: number;
   dateMin?: Date;
   dateMax?: Date;
   groups?: string[];
   attributes?: string[];
   includeHistorical?: boolean;
};

export function getAveragesRequest(baseUrl: string, parameters?: GetAveragesParams): Request {
   const url = new URL(`${baseUrl}/averages/`);

   if (parameters?.page) url.searchParams.append("page", parameters.page.toString());
   if (parameters?.limit) url.searchParams.append("limit", parameters.limit.toString());
   if (parameters?.dateMin) url.searchParams.append("date_min", parameters.dateMin.toISOString());
   if (parameters?.dateMax) url.searchParams.append("date_max", parameters.dateMax.toISOString());
   if (parameters?.groups) url.searchParams.append("groups", parameters.groups.join(","));
   if (parameters?.attributes) url.searchParams.append("attributes", parameters.attributes.join(","));
   if (parameters?.includeHistorical) url.searchParams.append("include_historical", "1");

   return new Request(url.toString());
}
