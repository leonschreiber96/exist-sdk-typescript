import type { AttributeTemplateId } from "./attributeTemplate.ts";
import type AttributeValueType from "./attributeValueType.ts";

type Attribute = {
   template: AttributeTemplateId;
   name: string;
   label: string;
   group: {
      name: string;
      label: string;
      priority: number;
   };
   service: {
      name: string;
      label: string;
   };
   active: boolean;
   priority: number;
   manual: boolean;
   value_type: AttributeValueType;
   value_type_description: string;
   available_services: {
      name: string;
      label: string;
   }[];
};

type AttributeWithValues<T> = Attribute & {
   values: {
      date: string;
      value: T;
   }[];
};

export type { Attribute, AttributeWithValues }; 