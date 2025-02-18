type Correlation = {
   date: string;
   period: number;
   offset: number;
   attribute: string;
   attribute2: string;
   value: number;
   p: number;
   percentage: number;
   stars: number;
   second_person: string;
   second_person_elements: string[];
   attribute_category: string;   
   strength_description: string;
   stars_description: string | null;
   description: string | null;
   occurrence: string | null;
   rating: {};
};

export type { Correlation };
