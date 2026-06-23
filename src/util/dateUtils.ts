const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function toDateString(date: Date | string): string {
   if (typeof date === "string") {
      if (!DATE_PATTERN.test(date)) {
         throw new Error(`Invalid date format "${date}" — expected YYYY-MM-DD.`);
      }
      return date;
   }
   return date.toISOString().split("T")[0];
}
