export type GetAttributesParams = {
   page?: number;
   limit?: number;
   groups?: string[];
   attributes?: string[];
   excludeCustom?: boolean;
   manual?: boolean;
   includeInactive?: boolean;
   includeLowPriority?: boolean;
   owned?: boolean;
};

export function getAttributesRequest(baseUrl: string, parameters?: GetAttributesParams): Request {
   const url = `${baseUrl}/attributes/`;

   const params = new URLSearchParams();
   if (parameters?.page) params.set("page", parameters.page.toString());
   if (parameters?.limit) params.set("limit", parameters.limit.toString());
   if (parameters?.groups) params.set("groups", parameters.groups.join(","));
   if (parameters?.attributes) {
      params.set("attributes", parameters.attributes.join(","));
   }
   if (parameters?.excludeCustom) params.set("exclude_custom", "true");
   if (parameters?.manual) params.set("manual", "true");
   if (parameters?.includeInactive) params.set("include_inactive", "true");
   if (parameters?.includeLowPriority) {
      params.set("include_low_priority", "true");
   }
   if (parameters?.owned) params.set("owned", "true");

   const urlWithParams = `${url}?${params.toString()}`;
   return new Request(urlWithParams, { method: "GET" });
}
