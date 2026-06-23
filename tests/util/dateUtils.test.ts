import { assertEquals, assertThrows } from "@std/assert";
import { toDateString } from "../../src/util/dateUtils.ts";

Deno.test("toDateString: Date object returns YYYY-MM-DD string", () => {
   assertEquals(toDateString(new Date("2025-03-15T00:00:00.000Z")), "2025-03-15");
});

Deno.test("toDateString: Date object uses UTC date component", () => {
   // midnight UTC on March 15 should not roll back to March 14
   assertEquals(toDateString(new Date("2025-03-15T00:00:00.000Z")), "2025-03-15");
});

Deno.test("toDateString: valid YYYY-MM-DD string passes through unchanged", () => {
   assertEquals(toDateString("2025-03-15"), "2025-03-15");
});

Deno.test("toDateString: DD-MM-YYYY format throws with helpful message", () => {
   assertThrows(() => toDateString("15-03-2025"), Error, "Invalid date format");
});

Deno.test("toDateString: ISO datetime string throws", () => {
   assertThrows(() => toDateString("2025-03-15T12:00:00Z"), Error, "Invalid date format");
});

Deno.test("toDateString: year-month only string throws", () => {
   assertThrows(() => toDateString("2025-03"), Error, "Invalid date format");
});

Deno.test("toDateString: empty string throws", () => {
   assertThrows(() => toDateString(""), Error, "Invalid date format");
});

Deno.test("toDateString: letters in date throw", () => {
   assertThrows(() => toDateString("abcd-ef-gh"), Error, "Invalid date format");
});
