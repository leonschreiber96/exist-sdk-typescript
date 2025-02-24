/**
 * Correlations are a measure of the relationship between two variables (see https://developer.exist.io/reference/object_types/).
 *
 * A positive correlation implies that as one variable increases (its values get higher), so does the other. A negative correlation implies that as one variable increases, the other decreases. We present these to users as a way to explain past trends, and use them to predict future behaviour.
 *
 * Correlation values vary between -1 and +1 with 0 implying no correlation. Correlations of -1 or +1 imply an exact linear relationship.
 *
 * P-values are a way of determining confidence in the result. A value lower than 0.05 is generally considered "statistically significant". We provide a user-friendly stars integer which maps to the P-value, where 5 stars indicates a value well below 0.05.
 *
 * We create simple English sentences to represent each possible correlation as a combination of attributes.
 *
 * We're also careful to represent these as correlations only, not as one attribute directly causing a change in the other, and we ask that you do the same. Correlation is not causation. There may be many hidden factors which underlie the relationship between two attributes. It is up to the user to determine the cause.
 *
 * Correlations are generated weekly on Sundays.
 */
interface Correlation {
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
   /** Used to distinguish "sub-correlations", that is, correlations for a subset of this attribute's data. For example, we may find a correlation between events in a specific calendar and productive_min — in this case, attribute_category would contain the name of the specific calendar. */
   attribute_category: string;
   /** Human-readable string describing the strength of the relationship in words. */
   strength_description: string;
   /** Human-readable string describing the star-rating of the relationship in words. */
   stars_description: string | null;
   /** Filled when both attributes are templated and we understand this relationship.
    * For example, for the productive_min and tracks positive correlation, description will provide some further information about why music helps us be more productive.
    */
   description: string | null;
   /** Filled when both attributes are templated and we understand this relationship.
    * For example, for the productive_min and tracks positive correlation, occurrence will be "Very common".
    */
   occurrence: string | null;
   /** Rating assigned by the user to this correlation. E.g., they may rate correlations as useful or arbitrary and choose to hide them. */
   rating: {
      positive: boolean;
      rating_type: number;
      rating: string;
   } | null;
}

export type { Correlation };
