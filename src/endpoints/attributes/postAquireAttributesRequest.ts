import type { AttributeTemplateId } from "../../model/attributeTemplate.ts";

type AcquireAttributeParam = {
   /** *Optional* Boolean flag to set this attribute as manually updated or not */
   manual?: boolean;

   /** *Optional* Boolean flag in query parameters which, if set, provides a full attribute object in the response for each successful acquisition */
   success_attributes?: boolean;
};

export type AquireAttributeTemplateParam = AcquireAttributeParam & {
   /** The name of the attribute template to acquire */
   template: AttributeTemplateId;
};

export type AcquireAttributeByNameParam = AcquireAttributeParam & {
   /** The name of the attribute to acquire */
   name: string;
};

export type AquireAttributesResponse = {
   success: { name: string; active: boolean }[];
   error: { title: string; error_code: string; error: string }[];
};

export function aquireAttributesRequest(
   baseUrl: string,
   parameters: (AquireAttributeTemplateParam | AcquireAttributeByNameParam)[],
): Request {
   const url = new URL(`${baseUrl}/attributes/acquire/`);

   return new Request(url.toString(), {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(parameters),
   });
}
