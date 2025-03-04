export type IncrementAttributeValueParam = {
   /** The attribute name, eg. `mood_note` */
   name: string;

   /** The date for which the value should be incremented. (Date or string of format `YYYY-mm-dd`) */
   date: Date | `${number}-${number}-${number}`;

   /** The amount by which the value should be incremented. */
   value: number;
};

export type IncrementAttributesResponse = {
   success: {
      name: string;
      value: number;
      current: number;
   }[];
   error: {
      name: string;
      date: string;
      error_code: string;
      error: string;
   }[];
};

export function incrementAttributeRequest(
   baseUrl: string,
   ...parameters: IncrementAttributeValueParam[]
) {
   const url = new URL(`${baseUrl}/attributes/increment/`);

   return new Request(url.toString(), {
      method: "POST",
      body: JSON.stringify(parameters),
   });
}
