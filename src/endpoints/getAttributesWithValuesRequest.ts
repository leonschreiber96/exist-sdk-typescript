export type GetAttributesWithValuesParams = {
   page?: number;
   limit?: number;
   days?: number;
   dateMax?: Date;
   groups?: string[];
   attributes?: string[];
   templates?: string[];
   manual?: boolean;
};

export function getAttributesWithValuesRequest(baseUrl: string, parameters?: GetAttributesWithValuesParams): Request {
   const url = new URL(`${baseUrl}/attributes/with-values/`);

   if (parameters?.page) url.searchParams.append("page", parameters.page.toString());
   if (parameters?.limit) url.searchParams.append("limit", parameters.limit.toString());
   if (parameters?.days) url.searchParams.append("days", parameters.days.toString());
   if (parameters?.dateMax) url.searchParams.append("date_max", parameters.dateMax.toISOString());
   if (parameters?.groups) url.searchParams.append("groups", parameters.groups.join(","));
   if (parameters?.attributes) url.searchParams.append("attributes", parameters.attributes.join(","));
   if (parameters?.templates) url.searchParams.append("templates", parameters.templates.join(","));
   if (parameters?.manual) url.searchParams.append("manual", "true");

   return new Request(url.toString());
}
