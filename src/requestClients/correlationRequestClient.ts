import AuthorizedRequestClient from "../authorization/authorizedRequestClient.ts";
import ExistAuthorizer from "../authorization/existAuthorizer.ts";
import { getCorrelationRequest } from "../endpoints/correlations/getCorrelationRequest.ts";
import { GetCorrelationsParams, getCorrelationsRequest } from "../endpoints/correlations/getCorrelationsRequest.ts";
import { Correlation } from "../model/correlation.ts";
import PaginatedResponse from "../model/paginatedResponse.ts";

export default class CorrelationRequestClient extends AuthorizedRequestClient {
   constructor(authorizer: ExistAuthorizer, baseUrl: string) {
      super(authorizer, baseUrl);
   }

   /**
    * Returns a paged list of all correlations generated in the last week, optionally filtered by attribute, strength, or confidence.
    * Results limited to your read scopes (see https://developer.exist.io/reference/correlations/#get-all-correlations).
    *
    * @param [parameters] *Optional* The query parameters to include in the request.
    * @returns A paginated response containing all correlations as `Correlation` objects.
    */
   public async getMany(parameters?: GetCorrelationsParams) {
      const request = getCorrelationsRequest(this.baseUrl, parameters);
      return await this.authAndFetch<PaginatedResponse<Correlation>>(request);
   }

   /**
    * Takes parameters for the two related attributes and returns one or zero correlations, depending on whether Exist has found something.
    * Will only return a result if at least one of the attributes is in your read scopes (see https://developer.exist.io/reference/correlations/#find-a-specific-correlation-combination).
    *
    * @param attribute1 - The name of the first attribute to compare.
    * @param attribute2 - The name of the second attribute to compare.
    * @returns The correlation between the two attributes as a `Correlation` object.
    */
   public async getSingle(attribute1: string, attribute2: string) {
      const request = getCorrelationRequest(this.baseUrl, [attribute1, attribute2]);
      return await this.authAndFetch<Correlation>(request);
   }
}
