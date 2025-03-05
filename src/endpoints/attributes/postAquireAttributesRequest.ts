import type { AttributeTemplateId } from "../../model/attributeTemplate.ts";

type AcquireAttributeParam = {
   /** *Optional* Boolean flag to set this attribute as manually updated or not */
   manual?: boolean;

   /** *Optional* Boolean flag in query parameters which, if set, provides a full attribute object in the response for each successful acquisition */
   success_attributes?: boolean;
};

/**
 * Represents the parameters for a request to acquire an attribute template.
 */
export type AquireAttributeTemplateParam = AcquireAttributeParam & {
   /** The name of the attribute template to acquire */
   template: AttributeTemplateId;
};

/**
 * Represents the parameters for a request to acquire an untemplated attribute by name.
 */
export type AcquireAttributeByNameParam = AcquireAttributeParam & {
   /** The name of the attribute to acquire */
   name: string;
};

/**
 * Represents the response from a request to acquire attributes.
 */
export type AquireAttributesResponse = {
   success: { name: string; active: boolean }[];
   error: { title: string; error_code: string; error: string }[];
};

/**
 * Returns a request object with a POST request that acquires attributes from attribute templates or by name.
 * @param baseUrl - The base URL for the REST API.
 * @param parameters - The parameters for acquiring the attributes.
 *
 * @returns A request object with a POST request for the `/attributes/acquire/` endpoint and the specified parameters.
 */
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
