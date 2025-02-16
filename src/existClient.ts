import ExistAuthorizer from "./authorization/existAuthorizer.ts";
import { GetAttributeParams, getAttributeRequest } from "./endpoints/getAttributeRequest.ts";
import { type GetAttributesParams, getAttributesRequest } from "./endpoints/getAttributesRequest.ts";
import { getAttributesWithValuesRequest } from "./endpoints/getAttributesWithValuesRequest.ts";
import {
   type GetAttributeTemplatesParams,
   getAttributeTemplatesRequest,
} from "./endpoints/getAttributeTemplatesRequest.ts";
import { type GetAveragesParams, getAveragesRequest } from "./endpoints/getAveragesRequest.ts";
import { getUserProfileRequest } from "./endpoints/getUserProfileRequest.ts";
import type { Attribute, AttributeWithValues } from "./model/attribute.ts";
import type { AttributeAverage } from "./model/attributeAverage.ts";
import type { AttributeTemplate } from "./model/attributeTemplate.ts";
import type { PaginatedResponse } from "./model/paginatedResponse.ts";
import type { UserProfile } from "./model/userProfile.ts";

const API_URL = "https://exist.io/api/2";

export default class ExistClient {
   private authorizer: ExistAuthorizer;

   constructor(authorizer: ExistAuthorizer) {
      this.authorizer = authorizer;
   }

   public async getUserProfile() {
      const request = getUserProfileRequest(API_URL);
      return await this.authAndFetch<UserProfile>(request);
   }

   public async getAverages(parameters?: GetAveragesParams) {
      const request = getAveragesRequest(API_URL, parameters);
      return await this.authAndFetch<PaginatedResponse<AttributeAverage>>(request);
   }

   public async getAttributeTemplates(parameters?: GetAttributeTemplatesParams) {
      const request = getAttributeTemplatesRequest(API_URL, parameters);
      return await this.authAndFetch<PaginatedResponse<AttributeTemplate>>(request);
   }

   public async getAttributes(parameters?: GetAttributesParams) {
      const request = getAttributesRequest(API_URL, parameters);
      return await this.authAndFetch<PaginatedResponse<Attribute>>(request);
   }

   public async getAttributesWithValues(parameters?: GetAttributesParams) {
      const request = getAttributesWithValuesRequest(API_URL, parameters);
      return await this.authAndFetch<PaginatedResponse<Attribute>>(request);
   }

   public async getAttribute<T>(attribute: string, parameters?: GetAttributeParams) {
      const request = getAttributeRequest(API_URL, attribute, parameters);
      return await this.authAndFetch<PaginatedResponse<AttributeWithValues<T>>>(request);
   }

   private async authAndFetch<T>(request: Request): Promise<T> {
      this.authorizer.authorizeRequest(request);
      const response = await fetch(request);

      if (!response.ok) {
         throw new Error(
            `Failed to fetch data: ${response.status} → ${response.statusText}`,
         );
      }

      const json = await response.json();
      return json as T;
   }
}
