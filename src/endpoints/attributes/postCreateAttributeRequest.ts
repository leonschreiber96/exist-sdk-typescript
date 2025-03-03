import Attribute from "../../model/attribute.ts";
import { AttributeTemplateId } from "../../model/attributeTemplate.ts";
import AttributeValueType from "../../model/attributeValueType.ts";

type CreateAttributeParams = {
   /** *Optional* boolean defining if the attribute is manually tracked, defaulting to `true` */
   manual?: boolean;

   /** *Optional* boolean which, if set in query params, returns full attribute objects on success rather than the contents of your request */
   successObjects?: boolean;
};

export type CreateTemplatedAttributeParams = CreateAttributeParams & {
   /** The name of the [attribute template](https://developer.exist.io/reference/object_types/#list-of-attribute-templates) to use */
   template: AttributeTemplateId;
};

export type CreateAttributeByNameParams = CreateAttributeParams & {
   /** User-facing title for the new attribute. */
   label: string;

   /** Name of the group this attribute will belong to. */
   group: string;

   /** [Value type](https://developer.exist.io/reference/object_types/#attribute-value-types) of the attribute. */
   valueType: AttributeValueType;
};

export type CreatettributesResponse = {
   success: Attribute[];
   error: { title: string; error_code: string; error: string }[];
};

export function createAttributeRequest(
   baseUrl: string,
   parameters: (CreateTemplatedAttributeParams | CreateAttributeByNameParams)[],
) {
   const url = new URL(`${baseUrl}/attributes/`);

   return new Request(url.toString(), {
      method: "POST",
      body: JSON.stringify(parameters),
   });
}
