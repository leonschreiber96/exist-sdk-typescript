import AuthorizedRequestClient from "../authorization/authorizedRequestClient.ts";
import type ExistAuthorizer from "../authorization/existAuthorizer.ts";
import { getCorrelationRequest } from "../endpoints/correlations/getCorrelationRequest.ts";
import {
   type GetCorrelationsParams,
   getCorrelationsRequest,
} from "../endpoints/correlations/getCorrelationsRequest.ts";
import type { Correlation } from "../model/correlation.ts";
import type { PaginatedResponse } from "../model/paginatedResponse.ts";
import { ExistApiError } from "../existApiError.ts";

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
   public async getMany(parameters?: GetCorrelationsParams): Promise<PaginatedResponse<Correlation>> {
      const request = getCorrelationsRequest(this.baseUrl, parameters);
      return await this.authAndFetch<PaginatedResponse<Correlation>>(request, "get correlations");
   }

   /**
    * Takes parameters for the two related attributes and returns the correlation if Exist has found one, or `null` if none exists.
    * Will only return a result if at least one of the attributes is in your read scopes (see https://developer.exist.io/reference/correlations/#find-a-specific-correlation-combination).
    *
    * @param attribute1 - The name of the first attribute to compare.
    * @param attribute2 - The name of the second attribute to compare.
    * @returns The correlation between the two attributes, or `null` if no correlation has been found.
    */
   public async getSingle(attribute1: string, attribute2: string): Promise<Correlation | null> {
      const request = getCorrelationRequest(this.baseUrl, [attribute1, attribute2]);
      try {
         return await this.authAndFetch<Correlation>(request, `get correlation for "${attribute1}" and "${attribute2}"`);
      } catch (e) {
         if (e instanceof ExistApiError && e.statusCode === 404) return null;
         throw e;
      }
   }
}
