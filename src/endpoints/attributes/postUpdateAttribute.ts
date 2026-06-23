import { toDateString } from "../../util/dateUtils.ts";

/**
 * Represents the parameters for a request to update an attribute value.
 */
export type UpdateAttributeValueParam<T> = {
   /** The attribute name, eg. `mood_note` */
   name: string;

   /** The date for which the value should be updated. Accepts a `Date` object or a `YYYY-MM-DD` string. */
   date: Date | string;

   /** A valid value for this attribute type. */
   value: T;
};

/**
 * Represents the response from a request to update attribute values.
 */
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

/**
 * Returns a request object with a POST request that updates attribute values.
 * @param baseUrl - The base URL for the REST API.
 * @param parameters - The parameters for updating the attribute values.
 *
 * @returns A request object with a POST request for the `/attributes/update/` endpoint and the specified parameters.
 */
export function updateAttributeRequest<T>(
   baseUrl: string,
   parameters: UpdateAttributeValueParam<T>[],
): Request {
   const url = new URL(`${baseUrl}/attributes/update/`);

   return new Request(url.toString(), {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(parameters.map((param) => ({
         name: param.name,
         date: toDateString(param.date),
         value: param.value,
      }))),
   });
}
