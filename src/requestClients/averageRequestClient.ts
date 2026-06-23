import AuthorizedRequestClient from "../authorization/authorizedRequestClient.ts";
import type ExistAuthorizer from "../authorization/existAuthorizer.ts";
import { type GetAveragesParams, getAveragesRequest } from "../endpoints/averages/getAveragesRequest.ts";
import type { AttributeAverage } from "../model/attributeAverage.ts";
import type { PaginatedResponse } from "../model/paginatedResponse.ts";

export default class AverageRequestClient extends AuthorizedRequestClient {
   constructor(authorizer: ExistAuthorizer, baseUrl: string) {
      super(authorizer, baseUrl);
   }

   /**
    * Returns the most recent average values for each attribute, one set per week.
    * Can be used to retrieve historical averages for attributes also. Results are limited to your read scopes
    * (see https://developer.exist.io/reference/averages/).
    *
    * @param [parameters] *Optional* The query parameters to include in the request.
    * @returns A paginated response containing the most recent average values for each attribute.
    */
   public async getMany(parameters?: GetAveragesParams): Promise<PaginatedResponse<AttributeAverage>> {
      const request = getAveragesRequest(this.baseUrl, parameters);
      return await this.authAndFetch<PaginatedResponse<AttributeAverage>>(request, "get averages");
   }
}
