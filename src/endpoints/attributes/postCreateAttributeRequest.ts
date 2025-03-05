import type { Attribute } from "../../model/attribute.ts";
import type { AttributeTemplateId } from "../../model/attributeTemplate.ts";
import type { AttributeValueType } from "../../model/attributeValueType.ts";

type CreateAttributeParams = {
   /** *Optional* boolean defining if the attribute is manually tracked, defaulting to `true` */
   manual?: boolean;

   /** *Optional* boolean which, if set in query params, returns full attribute objects on success rather than the contents of your request */
   successObjects?: boolean;
};

/**
 * Represents the parameters for a request to create an attribute from an attribute template.
 */
export type CreateTemplatedAttributeParams = CreateAttributeParams & {
   /** The name of the [attribute template](https://developer.exist.io/reference/object_types/#list-of-attribute-templates) to use */
   template: AttributeTemplateId;
};

/**
 * Represents the parameters for a request to create an untemplated attribute by name.
 */
export type CreateAttributeByNameParams = CreateAttributeParams & {
   /** User-facing title for the new attribute. */
   label: string;

   /** Name of the group this attribute will belong to. */
   group: string;

   /** [Value type](https://developer.exist.io/reference/object_types/#attribute-value-types) of the attribute. */
   valueType: AttributeValueType;
};

/**
 * Represents the response from a request to create attributes.
 */
export type CreatettributesResponse = {
   success: Attribute[];
   error: { title: string; error_code: string; error: string }[];
};

/**
 * Returns a request object with a POST request that creates attributes from attribute templates or by name.
 * @param baseUrl - The base URL for the REST API.
 * @param parameters - The parameters for creating the attributes.
 *
 * @returns A request object with a POST request for the `/attributes/` endpoint and the specified parameters.
 */
export function createAttributeRequest(
   baseUrl: string,
   parameters: (CreateTemplatedAttributeParams | CreateAttributeByNameParams)[],
): Request {
   const url = new URL(`${baseUrl}/attributes/`);

   return new Request(url.toString(), {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(parameters),
   });
}
