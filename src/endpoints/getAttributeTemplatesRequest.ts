export type GetAttributeTemplatesParams = {
   page?: number;
   limit?: number;
   includeLowPriority?: boolean;
   groups?: string[];
};

export function getAttributeTemplatesRequest(baseUrl: string, parameters?: GetAttributeTemplatesParams): Request {
   const url = new URL(`${baseUrl}/attributes/templates/`);

   if (parameters?.page) url.searchParams.append("page", parameters.page.toString());
   if (parameters?.limit) url.searchParams.append("limit", parameters.limit.toString());
   if (parameters?.includeLowPriority) url.searchParams.append("include_low_priority", "true");
   if (parameters?.groups) url.searchParams.append("groups", parameters.groups.join(","));

   return new Request(url.toString());
}
