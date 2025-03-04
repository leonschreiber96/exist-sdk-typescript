export type UpdateAttributeValueParam<T> = {
   /** The attribute name, eg. `mood_note` */
   name: string;

   /** The date for which the value should be updated. (Date or string of format `YYYY-mm-dd`) */
   date: Date | `${number}-${number}-${number}`;

   /** A valid value for this attribute type. */
   value: T;
};

export type UpdateAttributesResponse = {
   success: {
      name: string;
      date: string;
      value: string;
   }[];
   error: {
      name: string;
      date: string;
      error_code: string;
      error: string;
   }[];
};

export function updateAttributeRequest<T>(
   baseUrl: string,
   ...parameters: UpdateAttributeValueParam<T>[]
) {
   const url = new URL(`${baseUrl}/attributes/update/`);

   return new Request(url.toString(), {
      method: "POST",
      body: JSON.stringify(parameters),
   });
}
