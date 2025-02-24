import type { AttributeTemplateId } from "./attributeTemplate.ts";
import type AttributeValueType from "./attributeValueType.ts";

/**
 * Information about an attribute, e.g. "mood", "steps", "weight". (see https://developer.exist.io/reference/object_types/#attributes).
 *
 * This is our name for data points or individual numbers a user can track about themselves. These are tracked at a single day granularity — there's no per-hour or -minute data. Attributes can be string types but are usually quantifiable, i.e. integers or floats. The value_type field reflects this type.
 *
 * An attribute has many values, one for each day that it has been tracked. If requested, the values property will contain an array of date/value pairs.
 *
 * Attributes can be "templated", meaning they take their name and other values from an attribute template we provide. In this case, the attribute's name will be known, as it matches the template. See also [list of attribute templates](https://developer.exist.io/reference/object_types/#list-of-attribute-templates) and [attribute value types](https://developer.exist.io/reference/object_types/#attribute-value-types).
 *
 * If there is no data for a particular date, this will be reflected with a null value — you should expect to receive a list of results containing every single day, rather than days without data being omitted.
 */
interface Attribute {
   template: AttributeTemplateId;
   /** Unique ID of the attribute. */
   name: string;
   /** Human-readable name of the attribute. */
   label: string;
   /** Each attribute belongs to a group, e.g. "hours_asleep" belongs to the "sleep" category. */
   group: {
      /** Unique ID of the group. */
      name: string;
      /** Human-readable name of the group. */
      label: string;
      /** Used for sorting (in ascending order). */
      priority: number;
   };
   service: {
      name: string;
      label: string;
   };
   active: boolean;
   /** Used for sorting (in ascending order). */
   priority: number;
   /** Manual attributes are those which are not automatically filled with data from a supported integration, but instead have manual entry UI provided within our official clients. If you're creating a client that will provide data for attributes, you want manual to be false. */
   manual: boolean;
   /** The type of value this attribute can take (see [here](https://developer.exist.io/reference/object_types/#attribute-value-types) for a list of possible value types). */
   value_type: AttributeValueType;
   value_type_description: string;
   /** Services connected to the authorized user's Exist account that are able to track this attribute. */
   available_services: {
      /** Unique ID of the service. */
      name: string;
      /** Human-readable name of the service. */
      label: string;
   }[];
   /** List of tracked values for this attribute (date ↔ value pairs). */
   values: {
      date: string;
      value: string;
   };
}

export type { Attribute };
