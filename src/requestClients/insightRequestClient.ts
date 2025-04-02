import AuthorizedRequestClient from "../authorization/authorizedRequestClient.ts";
import type ExistAuthorizer from "../authorization/existAuthorizer.ts";
import { type GetInsightsParams, getInsightsRequest } from "../endpoints/insights/getInsightsRequest.ts";
import type { Insight } from "../model/insight.ts";
import type { PaginatedResponse } from "../model/paginatedResponse.ts";

export default class InsightRequestClient extends AuthorizedRequestClient {
   constructor(authorizer: ExistAuthorizer, baseUrl: string) {
      super(authorizer, baseUrl);
   }

   /**
    * Returns a paged list of the authenticated user's insights (see [the definition](https://developer.exist.io/reference/object_types/)). Results are limited to your read scopes. (see https://developer.exist.io/reference/insights/#get-all-insights)
    *
    * @param [parameters] *Optional* The query parameters to include in the request.
    * @returns A paginated response containing the insights for the authenticated user as `Insight` objects.
    */
   public async getMany(parameters?: GetInsightsParams): Promise<PaginatedResponse<Insight>> {
      const request = getInsightsRequest(this.baseUrl, parameters);
      const response = await this.authAndFetch<PaginatedResponse<Insight>>(request);

      if (response.statusCode !== 200) {
         throw new Error(`Failed to get insights: ${response.statusCode}`);
      }

      return response as PaginatedResponse<Insight>;
   }
}
