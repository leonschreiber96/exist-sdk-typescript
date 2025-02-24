/**
 * These are the allowed types of values an attribute can store. Each attribute has a single, fixed value type (see https://developer.exist.io/reference/object_types/#attribute-value-types).
 *
 * **Note:** value type 6 (minutes from midday) is reserved for attribute templates. New attributes cannot be created via the API with this value type.
 */
enum AttributeValueType {
   /** Integer quantity.    */
   QUANTITY = 0,
   /** Decimal number. */
   DECIMAL = 1,
   /** Textual data. */
   STRING = 2,
   /** Duration (minutes as integer). */
   DURATION = 3,
   /** Time of day (minutes from midnight as integer). */
   TIMEOFDAY = 4,
   /** Percentage (float, 0.0 to 1.0). */
   PERCENTAGE = 5,
   /** Time of day (minutes from midday as integer).
    *
    *  **Note:** This is reserved for attribute templates. New attributes cannot be created via the API with this value type.
    */
   TIMEOFDAYFROMMIDDAY = 6,
   /** Boolean Data. */
   BOOLEAN = 7,
   /** Scale (1-9 as integer) */
   SCALE = 8,
}

export default AttributeValueType;
