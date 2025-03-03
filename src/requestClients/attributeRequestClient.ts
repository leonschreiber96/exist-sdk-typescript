import ExistAuthorizer from "../authorization/existAuthorizer.ts";
import Attribute from "../model/attribute.ts";
import PaginatedResponse from "../model/paginatedResponse.ts";
import { GetAttributeParams, getAttributeRequest } from "../endpoints/attributes/getAttributeRequest.ts";
import AuthorizedRequestClient from "../authorization/authorizedRequestClient.ts";
import { getAttributesWithValuesRequest } from "../endpoints/attributes/getAttributesWithValuesRequest.ts";
import {
   GetAttributeTemplatesParams,
   getAttributeTemplatesRequest,
} from "../endpoints/attributes/getAttributeTemplatesRequest.ts";
import { GetAttributesParams, getAttributesRequest } from "../endpoints/attributes/getAttributesRequest.ts";
import { AttributeTemplate } from "../model/attributeTemplate.ts";

export default class AttributeRequestClient extends AuthorizedRequestClient {
   constructor(authorizer: ExistAuthorizer, baseUrl: string) {
      super(authorizer, baseUrl);
   }

   /**
    * Retrieve a list of the attribute templates Exist supports (see https://developer.exist.io/reference/attributes/#get-attribute-templates).
    * @param [parameters] *Optional* The query parameters to include in the request.
    *
    * @returns A paginated response containing all available attribute templates.
    */
   public async getTemplates(parameters?: GetAttributeTemplatesParams) {
      const request = getAttributeTemplatesRequest(this.baseUrl, parameters);
      return await this.authAndFetch<PaginatedResponse<AttributeTemplate>>(request);
   }

   /**
    * Retrieve a list of the user's attributes, without any values. Results are limited to your read scopes. (see https://developer.exist.io/reference/attributes/#get-a-users-attributes).
    * @param [parameters] - *Optional* The query parameters to include in the request.
    *
    * @returns A paginated response containing the user's attributes.
    */
   public async getAttributes(parameters?: GetAttributesParams) {
      const request = getAttributesRequest(this.baseUrl, parameters);
      return await this.authAndFetch<PaginatedResponse<Attribute>>(request);
   }

   /**
    * Retrieve a list of the user's attributes and their recent values. Results are limited to your read scopes. (see https://developer.exist.io/reference/attributes/#get-a-users-attributes-with-values).
    * @param [parameters] - *Optional* The query parameters to include in the request.
    *
    * @returns A paginated response containing the user's attributes with the value field populated.
    */
   public async getAttributesWithValues(parameters?: GetAttributesParams) {
      const request = getAttributesWithValuesRequest(this.baseUrl, parameters);
      return await this.authAndFetch<PaginatedResponse<Attribute>>(request);
   }

   /**
    * Retrieve a list of all values from an attribute. Results are limited to your read scopes. (see https://developer.exist.io/reference/attributes/#get-an-attribute).
    * @param attribute - The name of the attribute to retrieve.
    * @param [parameters] - *Optional* The query parameters to include in the request.
    *
    * @returns A paginated response containing all values for the specified attribute.
    */
   public async getAttribute(attribute: string, parameters?: GetAttributeParams) {
      const request = getAttributeRequest(this.baseUrl, attribute, parameters);
      return await this.authAndFetch<PaginatedResponse<Attribute>>(request);
   }
}
