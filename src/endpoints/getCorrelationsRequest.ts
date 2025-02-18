export type GetCorrelationsParams = {
   page?: number;
   limit?: number;
   strong?: boolean;
   confident?: boolean;
   attribute?: string;
};

export function getCorrelationsRequest(baseUrl: string, parameters?: GetCorrelationsParams) {
   const url = new URL(`${baseUrl}/correlations/`);

   if (parameters?.page) url.searchParams.append("page", parameters.page.toString());
   if (parameters?.limit) url.searchParams.append("limit", parameters.limit.toString());
   if (parameters?.strong) url.searchParams.append("strong", "1");
   if (parameters?.confident) url.searchParams.append("confident", "1");
   if (parameters?.attribute) url.searchParams.append("attribute", parameters.attribute);

   return new Request(url.toString());
}
