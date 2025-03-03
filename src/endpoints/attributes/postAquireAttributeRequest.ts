export type AcquireAttributeParams = {
   /** *Optional* Boolean flag to set this attribute as manually updated or not */
   manual?: boolean;

   /** *Optional* Boolean flag in query parameters which, if set, provides a full attribute object in the response for each successful acquisition */
   success_attributes?: boolean;
};

export function aquireAttributeTemplateRequest(baseUrl: string, template: string, parameters?: AcquireAttributeParams) {
   const url = new URL(`${baseUrl}/attributes/acquire/`);

   if (parameters?.manual) url.searchParams.append("manual", parameters.manual.toString());
   if (parameters?.success_attributes) {
      url.searchParams.append("success_attributes", parameters.success_attributes.toString());
   }
   url.searchParams.append("template", template);

   return new Request(url.toString(), {
      method: "POST",
   });
}

export function aquireAttributeRequest(baseUrl: string, name: string, parameters?: AcquireAttributeParams) {
   const url = new URL(`${baseUrl}/attributes/acquire/`);

   if (parameters?.manual) url.searchParams.append("manual", parameters.manual.toString());
   if (parameters?.success_attributes) {
      url.searchParams.append("success_attributes", parameters.success_attributes.toString());
   }
   url.searchParams.append("name", name);

   return new Request(url.toString(), {
      method: "POST",
   });
}
