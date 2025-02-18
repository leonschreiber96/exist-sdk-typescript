import AttributeValueType from "./attributeValueType.ts";

export type Insight = {
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
};
