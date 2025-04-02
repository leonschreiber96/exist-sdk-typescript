import type ExistAuthorizer from "../authorization/existAuthorizer.ts";
import type { Attribute } from "../model/attribute.ts";
import type { PaginatedResponse } from "../model/paginatedResponse.ts";
import { type GetAttributeParams, getAttributeRequest } from "../endpoints/attributes/getAttributeRequest.ts";
import AuthorizedRequestClient from "../authorization/authorizedRequestClient.ts";
import { getAttributesWithValuesRequest } from "../endpoints/attributes/getAttributesWithValuesRequest.ts";
import {
   type GetAttributeTemplatesParams,
   getAttributeTemplatesRequest,
} from "../endpoints/attributes/getAttributeTemplatesRequest.ts";
import { type GetAttributesParams, getAttributesRequest } from "../endpoints/attributes/getAttributesRequest.ts";
import type { AttributeTemplate } from "../model/attributeTemplate.ts";
import {
   type AcquireAttributeByNameParam,
   aquireAttributesRequest,
   type AquireAttributesResponse,
   type AquireAttributeTemplateParam,
} from "../endpoints/attributes/postAquireAttributesRequest.ts";
import {
   releaseAttributesRequest,
   type ReleaseAttributesResponse,
} from "../endpoints/attributes/postReleaseAttributesRequest.ts";
import {
   type CreateAttributeByNameParams,
   createAttributeRequest,
   type CreateTemplatedAttributeParams,
} from "../endpoints/attributes/postCreateAttributeRequest.ts";
import {
   updateAttributeRequest,
   type UpdateAttributesResponse,
   type UpdateAttributeValueParam,
} from "../endpoints/attributes/postUpdateAttribute.ts";
import {
   incrementAttributeRequest,
   type IncrementAttributesResponse,
   type IncrementAttributeValueParam,
} from "../endpoints/attributes/postIncrementUpdate.ts";

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
   public async getTemplates(parameters?: GetAttributeTemplatesParams): Promise<PaginatedResponse<AttributeTemplate>> {
      const request = getAttributeTemplatesRequest(this.baseUrl, parameters);
      const response = await this.authAndFetch<PaginatedResponse<AttributeTemplate>>(request);

      if (response.statusCode !== 200) {
         throw new Error(`Failed to get attribute templates: ${response.statusCode}`);
      }

      return response as PaginatedResponse<AttributeTemplate>;
   }

   /**
    * Retrieve a list of the user's attributes, **without any values**. Results are limited to your read scopes. (see https://developer.exist.io/reference/attributes/#get-a-users-attributes).
    * @param [parameters] - *Optional* The query parameters to include in the request.
    *
    * @returns A paginated response containing the user's attributes.
    */
   public async getMany(parameters?: GetAttributesParams): Promise<PaginatedResponse<Attribute>> {
      const request = getAttributesRequest(this.baseUrl, parameters);
      const response = await this.authAndFetch<PaginatedResponse<Attribute>>(request);

      if (response.statusCode !== 200) {
         throw new Error(`Failed to get attributes: ${response.statusCode}`);
      }

      return response as PaginatedResponse<Attribute>;
   }

   /**
    * Retrieve a list of the user's attributes and their recent values. Results are limited to your read scopes. (see https://developer.exist.io/reference/attributes/#get-a-users-attributes-with-values).
    * @param [parameters] - *Optional* The query parameters to include in the request.
    *
    * @returns A paginated response of attribute objects belonging to this user.
    * `available_services` shows the services a user has connected which have indicated they can provide data for this attribute.
    */
   public async getManyWithValues(parameters?: GetAttributesParams): Promise<PaginatedResponse<Attribute>> {
      const request = getAttributesWithValuesRequest(this.baseUrl, parameters);
      const response = await this.authAndFetch<PaginatedResponse<Attribute>>(request);

      if (response.statusCode !== 200) {
         throw new Error(`Failed to get attributes with values: ${response.statusCode}`);
      }

      return response as PaginatedResponse<Attribute>;
   }

   /**
    * Retrieve a list of the user's attributes, without any values. Results are limited to what your service already owns. (see https://developer.exist.io/reference/attribute_ownership/#list-owned-attributes).
    *
    * @param [parameters] - *Optional* The query parameters to include in the request.
    * @returns A paginated response containing all attributes owned by the user.
    */
   public async getOwned(parameters?: GetAttributesParams): Promise<PaginatedResponse<Attribute>> {
      const request = getAttributesRequest(this.baseUrl, parameters);
      const response = await this.authAndFetch<PaginatedResponse<Attribute>>(request);

      if (response.statusCode !== 200) {
         throw new Error(`Failed to get owned attributes: ${response.statusCode}`);
      }

      return response as PaginatedResponse<Attribute>;
   }

   /**
    * Retrieve a list of all values from an attribute. Results are limited to your read scopes. (see https://developer.exist.io/reference/attributes/#get-an-attribute).
    * @param attribute - The name of the attribute to retrieve.
    * @param [parameters] - *Optional* The query parameters to include in the request.
    *
    * @returns A paginated response containing all values for the specified attribute.
    */
   public async getValuesForAttribute<T>(
      attribute: string,
      parameters?: GetAttributeParams,
   ): Promise<PaginatedResponse<{ date: string; value: T }>> {
      const request = getAttributeRequest(this.baseUrl, attribute, parameters);
      const response = await this.authAndFetch<PaginatedResponse<{ date: string; value: T }>>(request);

      if (response.statusCode !== 200) {
         throw new Error(`Failed to get attribute: ${response.statusCode}`);
      }

      return response as PaginatedResponse<{ date: string; value: T }>;
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
   public async acquire(
      parameters: (AquireAttributeTemplateParam | AcquireAttributeByNameParam)[],
   ): Promise<AquireAttributesResponse> {
      const request = aquireAttributesRequest(this.baseUrl, parameters);
      const response = await this.authAndFetch<AquireAttributesResponse>(request);

      if (response.statusCode !== 200) {
         throw new Error(`Failed to acquire attributes: ${response.statusCode}`);
      }

      return response as AquireAttributesResponse;
   }

   /**
    * Release an attribute, giving up ownership of it.
    * This will allow the user to acquire the attribute themselves or for another service to acquire it.
    * (see https://developer.exist.io/reference/attribute_ownership/#release-attributes)
    *
    * @param attributes - List of attributes to release.
    * @returns A list of successfully released attributes and any errors that occurred (incl. name of the attribute for which they occurred).
    */
   public async release(...attributes: string[]): Promise<ReleaseAttributesResponse> {
      const request = releaseAttributesRequest(this.baseUrl, ...attributes);
      const response = await this.authAndFetch<ReleaseAttributesResponse>(request);

      if (response.statusCode !== 200) {
         throw new Error(`Failed to release attributes: ${response.statusCode}`);
      }

      return response as ReleaseAttributesResponse;
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
   public async createNew(
      parameters: (CreateTemplatedAttributeParams | CreateAttributeByNameParams)[],
   ): Promise<AquireAttributesResponse> {
      const request = createAttributeRequest(this.baseUrl, parameters);

      const response = await this.authAndFetch<AquireAttributesResponse>(request);

      if (response.statusCode !== 200) {
         throw new Error(`Failed to create attributes: ${response.statusCode}`);
      }

      return response as AquireAttributesResponse;
   }

   /**
    * This endpoint allows services to update attribute data for the authenticated user in batches of up to 35 updates in one call. This may include, for example, 35 days of data for one attribute, or one day's values across 35 attributes. Batching updates is strongly encouraged to avoid multiple calls to the API.

      Data is stored on a single day granularity, so each update contains `name`, `date`, and `value`. Make sure the date is local to the user — though you do not have to worry about timezones directly, if you are using your local time instead of the user's local time, you may be a day ahead or behind!

      Valid values are described by the attribute's `value_type` and `value_type_description` fields. However, values are only validated broadly by type and so care must be taken to send correct data. Do not rely on Exist to validate your values beyond enforcing the correct type. This endpoint accepts total values for attributes and overwrites the previous value with the (validated) value you send. Non-null values cannot be set back to null, to prevent accidental data loss.

      Check value types for each attribute in [list of supported attributes](https://developer.exist.io/reference/object_types/#list-of-attribute-templates).
    *
    * @param [parameters] List of attributes to update.
    * @returns A list of successfully updated attributes and any errors that occurred (incl. name of the attribute for which they occurred).
    */
   public async updateValues<T>(...parameters: UpdateAttributeValueParam<T>[]): Promise<UpdateAttributesResponse> {
      const request = updateAttributeRequest<T>(this.baseUrl, ...parameters);
      const response = await this.authAndFetch<UpdateAttributesResponse>(request);

      if (response.statusCode !== 200) {
         throw new Error(`Failed to update attributes: ${response.statusCode}`);
      }

      return response as UpdateAttributesResponse;
   }

   /**
    * While the update endpoint requires total values to be sent for a day, the increment endpoint allows sending deltas, or the change in value to be applied to the existing value.
    * For example, to set a value `fridge_opens`, a count of how many times the refrigerator door is opened for a day, the update endpoint requires storing the total each day and sending this new total each time the door is opened.
    * In contrast, the increment endpoint is happy to accept a `1` value for `fridge_opens`, removing the need for the client to remember the current state.

      The attributes must already exist and be owned by your service.

      Valid values are described by the attribute's `value_type` and `value_type_description` fields. However, values are only validated broadly by type and so care must be taken to send correct data.
      Do not rely on Exist to validate your values beyond enforcing the correct type.
      **This endpoint will not allow incrementing string, scale, or time of day attributes.**

      Check value types for each attribute in [list of supported attributes](https://developer.exist.io/reference/object_types/#list-of-attribute-templates).

      @param [parameters] List of attributes to increment.
      @returns A list of successfully incremented attributes and any errors that occurred (incl. name of the attribute for which they occurred
    */
   public async incrementValues(...parameters: IncrementAttributeValueParam[]): Promise<IncrementAttributesResponse> {
      const request = incrementAttributeRequest(this.baseUrl, ...parameters);
      const response = await this.authAndFetch<IncrementAttributesResponse>(request);

      if (response.statusCode !== 200) {
         throw new Error(`Failed to increment attributes: ${response.statusCode}`);
      }

      return response as IncrementAttributesResponse;
   }
}
