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
   const url = new URL(`${baseUrl}/attributes/`);

   if (parameters?.page) url.searchParams.append("page", parameters.page.toString());
   if (parameters?.limit) url.searchParams.append("limit", parameters.limit.toString());
   if (parameters?.groups) url.searchParams.append("groups", parameters.groups.join(","));
   if (parameters?.attributes) url.searchParams.append("attributes", parameters.attributes.join(","));
   if (parameters?.excludeCustom) url.searchParams.append("exclude_custom", "1");
   if (parameters?.manual) url.searchParams.append("manual", "1");
   if (parameters?.includeInactive) url.searchParams.append("include_inactive", "1");
   if (parameters?.includeLowPriority) url.searchParams.append("include_low_priority", "1");
   if (parameters?.owned) url.searchParams.append("owned", "1");

   return new Request(url.toString());
}
