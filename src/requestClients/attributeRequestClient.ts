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
import {
   AcquireAttributeByNameParam,
   aquireAttributesRequest,
   AquireAttributesResponse,
   AquireAttributeTemplateParam,
} from "../endpoints/attributes/postAquireAttributesRequest.ts";
import {
   releaseAttributesRequest,
   ReleaseAttributesResponse,
} from "../endpoints/attributes/postReleaseAttributesRequest.ts";
import {
   CreateAttributeByNameParams,
   createAttributeRequest,
   CreateTemplatedAttributeParams,
} from "../endpoints/attributes/postCreateAttributeRequest.ts";

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
    * Retrieve a list of the user's attributes, **without any values**. Results are limited to your read scopes. (see https://developer.exist.io/reference/attributes/#get-a-users-attributes).
    * @param [parameters] - *Optional* The query parameters to include in the request.
    *
    * @returns A paginated response containing the user's attributes.
    */
   public async getMany(parameters?: GetAttributesParams) {
      const request = getAttributesRequest(this.baseUrl, parameters);
      return await this.authAndFetch<PaginatedResponse<Attribute>>(request);
   }

   /**
    * Retrieve a list of the user's attributes and their recent values. Results are limited to your read scopes. (see https://developer.exist.io/reference/attributes/#get-a-users-attributes-with-values).
    * @param [parameters] - *Optional* The query parameters to include in the request.
    *
    * @returns A paginated response of attribute objects belonging to this user.
    * `available_services` shows the services a user has connected which have indicated they can provide data for this attribute.
    */
   public async getManyWithValues(parameters?: GetAttributesParams) {
      const request = getAttributesWithValuesRequest(this.baseUrl, parameters);
      return await this.authAndFetch<PaginatedResponse<Attribute>>(request);
   }

   /**
    * Retrieve a list of the user's attributes, without any values. Results are limited to what your service already owns. (see https://developer.exist.io/reference/attribute_ownership/#list-owned-attributes).
    *
    * @param [parameters] - *Optional* The query parameters to include in the request.
    * @returns A paginated response containing all attributes owned by the user.
    */
   public async getOwned(parameters?: GetAttributesParams) {
      const request = getAttributesRequest(this.baseUrl, parameters);
      return await this.authAndFetch<PaginatedResponse<Attribute>>(request);
   }

   /**
    * Retrieve a list of all values from an attribute. Results are limited to your read scopes. (see https://developer.exist.io/reference/attributes/#get-an-attribute).
    * @param attribute - The name of the attribute to retrieve.
    * @param [parameters] - *Optional* The query parameters to include in the request.
    *
    * @returns A paginated response containing all values for the specified attribute.
    */
   public async getSingle(attribute: string, parameters?: GetAttributeParams) {
      const request = getAttributeRequest(this.baseUrl, attribute, parameters);
      return await this.authAndFetch<PaginatedResponse<Attribute>>(request);
   }

   /**
    * Acquiring an attribute makes your client the owner of the attribute.
    * This allows a service to write values for this attribute.
    * Users do not have to approve this (mostly because this would be cumbersome) so please explain/confirm this behaviour with users within your own application.
    * Acquiring a templated attribute the user doesn't have yet will create this attribute and give you ownership.
    * (see https://developer.exist.io/reference/attribute_ownership/#acquire-attributes)
    *
    * @param [parameters] - List of attributes to acquire with [optional parameters](https://developer.exist.io/reference/attribute_ownership/#parameters).
    * @returns A list of successfully acquired attributes and any errors that occurred (incl. name of the attribute for which they occurred).
    */
   public async acquire(parameters: (AquireAttributeTemplateParam | AcquireAttributeByNameParam)[]) {
      const request = aquireAttributesRequest(this.baseUrl, parameters);
      return await this.authAndFetch<AquireAttributesResponse>(request);
   }

   /**
    * Release an attribute, giving up ownership of it.
    * This will allow the user to acquire the attribute themselves or for another service to acquire it.
    * (see https://developer.exist.io/reference/attribute_ownership/#release-attributes)
    *
    * @param attributes - List of attributes to release.
    * @returns A list of successfully released attributes and any errors that occurred (incl. name of the attribute for which they occurred).
    */
   public async release(...attributes: string[]) {
      const request = releaseAttributesRequest(this.baseUrl, ...attributes);
      return await this.authAndFetch<ReleaseAttributesResponse>(request);
   }

   /**
    * Creates the specified attributes for the user. (see https://developer.exist.io/reference/creating_attributes/#parameters_2).
    *
    * Write scopes allow your client to create new attributes for a user in the matching scopes.
    * These attributes can be templated, or entirely custom.
    * The manual_write scope allows creating manual attributes in any group.
    * If you choose not to use a template, an entirely custom attribute can be defined, with its own label and value type.
    * It must belong to an existing group.
    *
    * @param [parameters] List of attributes to create. Can be templated or custom (see https://developer.exist.io/reference/creating_attributes/#parameters).
    *
    * @returns A list of successfully created attributes and any errors that occurred (incl. name of the attribute for which they occurred).
    */
   public async createNew(parameters: (CreateTemplatedAttributeParams | CreateAttributeByNameParams)[]) {
      const request = createAttributeRequest(this.baseUrl, parameters);
      return await this.authAndFetch<AquireAttributesResponse>(request);
   }
}
