export type GetAttributeParams = {
   limit?: number;
   page?: number;
   dateMax?: Date;
};

export function getAttributeRequest(baseUrl: string, attribute: string, parameters?: GetAttributeParams): Request {
   const url = new URL(`${baseUrl}/attributes/values/`);

   url.searchParams.append("attribute", attribute);
   if (parameters?.limit) url.searchParams.append("limit", parameters.limit.toString());
   if (parameters?.page) url.searchParams.append("page", parameters.page.toString());
   if (parameters?.dateMax) url.searchParams.append("date_max", parameters.dateMax.toISOString());

   return new Request(url.toString());
}
