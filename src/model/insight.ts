import AttributeValueType from "./attributeValueType.ts";

/**
 * Insights are interesting events found within the user's data (see https://developer.exist.io/reference/object_types/#insights).
 *
 * These are not triggered by the user but generated automatically if the values for an attribute fit an insight type's criteria. Typically these fall into a few categories: day-level events, for example, yesterday was the highest or lowest steps value in however many days; and week and month-level events, like summaries of total steps walked for the month. If an insight is relevant to a specific day it will contain a target_date value.
 *
 * Insights have a priority where 1 is highest and means real-time, 2 is day-level, 3 is week, and 4 is month.
 *
 * HTML and text output is provided.
 */
export interface Insight {
   created: string;
   target_date: string;
   type: {
      name: string;
      period: number;
      priority: number;
      attribute: {
         name: string;
         label: string;
         group: {
            name: string;
            label: string;
            priority: number;
         };
         priority: number;
         value_type: AttributeValueType;
         value_type_description: string;
      };
   };
   html: string;
   text: string;
}
