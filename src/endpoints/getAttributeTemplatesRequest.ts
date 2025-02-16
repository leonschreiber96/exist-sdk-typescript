export type GetAttributeTemplatesParams = {
   page?: number;
   limit?: number;
   includeLowPriority?: boolean;
   groups?: string[];
};

export function getAttributeTemplatesRequest(baseUrl: string, parameters?: GetAttributeTemplatesParams): Request {
   const url = `${baseUrl}/attributes/templates/`;

   const params = new URLSearchParams();
   if (parameters?.page) params.set("page", parameters.page.toString());
   if (parameters?.limit) params.set("limit", parameters.limit.toString());
   if (parameters?.includeLowPriority) {
      params.set("include_low_priority", "true");
   }
   if (parameters?.groups) params.set("groups", parameters.groups.join(","));

   const urlWithParams = `${url}?${params.toString()}`;
   return new Request(urlWithParams, { method: "GET" });
}
