export type GetAveragesParams = {
   page?: number;
   limit?: number;
   dateMin?: Date;
   dateMax?: Date;
   groups?: string[];
   attributes?: string[];
   includeHistorical?: boolean;
};

export function getAveragesRequest(
   baseUrl: string,
   parameters?: GetAveragesParams,
): Request {
   const url = `${baseUrl}/averages/`;

   const params = new URLSearchParams();
   if (parameters?.page) params.set("page", parameters.page.toString());
   if (parameters?.limit) params.set("limit", parameters.limit.toString());
   if (parameters?.dateMin) {
      params.set("date_min", parameters.dateMin.toISOString());
   }
   if (parameters?.dateMax) {
      params.set("date_max", parameters.dateMax.toISOString());
   }
   if (parameters?.groups) params.set("groups", parameters.groups.join(","));
   if (parameters?.attributes) {
      params.set("attributes", parameters.attributes.join(","));
   }
   if (parameters?.includeHistorical) {
      params.set("include_historical", "true");
   }

   const urlWithParams = `${url}?${params.toString()}`;
   const request = new Request(urlWithParams, { method: "GET" });
   return request;
}
