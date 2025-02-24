/** Averages are generated weekly and are the basis of our goal system (see https://developer.exist.io/reference/object_types/#averages).
 *
 * In our clients, the average is used to create the "end value" of the attribute's progress bar for a single day — meaning each day, users are being shown their progress relative to their usual behaviour.
 *
 * We break down averages by day of the week but also record the overall average. As we keep historical data this allows us to plot "rolling averages" showing changes in attribute values. The data set for finding the average is always the last 60 days' data.
 *
 * **Note:** these are actually medians, but we use "average" as it's simpler to explain to users. Please also use this terminology. */
interface AttributeAverage {
   attribute: string;
   date: string;
   overall: number;
   monday: number;
   tuesday: number;
   wednesday: number;
   thursday: number;
   friday: number;
   saturday: number;
   sunday: number;
}

export type { AttributeAverage };
