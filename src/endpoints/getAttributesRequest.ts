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
   if (parameters?.excludeCustom) url.searchParams.append("exclude_custom", "true");
   if (parameters?.manual) url.searchParams.append("manual", "true");
   if (parameters?.includeInactive) url.searchParams.append("include_inactive", "true");
   if (parameters?.includeLowPriority) url.searchParams.append("include_low_priority", "true");
   if (parameters?.owned) url.searchParams.append("owned", "true");

   return new Request(url.toString());
}
