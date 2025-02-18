export type GetCorrelationsParams = {
   attribute: string;
   attribute2: string;
};

export function getCorrelationRequest(baseUrl: string, parameters: GetCorrelationsParams) {
   const url = new URL(`${baseUrl}/correlations/combo/`);

   url.searchParams.append("attribute", parameters.attribute);
   url.searchParams.append("attribute2", parameters.attribute2);

   return new Request(url.toString());
}
