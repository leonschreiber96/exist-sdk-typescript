/**
 * Represents the parameters for a request to increment attribute values.
 */
export type IncrementAttributeValueParam = {
   /** The attribute name, eg. `mood_note` */
   name: string;

   /** The date for which the value should be incremented. (Date or string of format `YYYY-mm-dd`) */
   date: Date | `${number}-${number}-${number}`;

   /** The amount by which the value should be incremented. */
   value: number;
};

/**
 * Represents the response from a request to increment attribute values.
 */
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

/**
 * Returns a request object with a POST request that increments attribute values.
 * @param baseUrl - The base URL for the REST API.
 * @param parameters - The parameters for incrementing the attribute values.
 *
 * @returns A request object with a POST request for the `/attributes/increment/` endpoint and the specified parameters.
 */
export function incrementAttributeRequest(
   baseUrl: string,
   ...parameters: IncrementAttributeValueParam[]
): Request {
   const url = new URL(`${baseUrl}/attributes/increment/`);

   return new Request(url.toString(), {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(parameters),
   });
}
