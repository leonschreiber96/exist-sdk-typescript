import AuthorizedRequestClient from "../authorization/authorizedRequestClient.ts";
import ExistAuthorizer from "../authorization/existAuthorizer.ts";
import { GetInsightsParams, getInsightsRequest } from "../endpoints/insights/getInsightsRequest.ts";
import Insight from "../model/insight.ts";
import PaginatedResponse from "../model/paginatedResponse.ts";

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
   public async getMany(parameters?: GetInsightsParams) {
      const request = getInsightsRequest(this.baseUrl, parameters);
      return await this.authAndFetch<PaginatedResponse<Insight>>(request);
   }
}
