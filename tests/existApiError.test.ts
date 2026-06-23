import { assertEquals, assertInstanceOf } from "@std/assert";
import { ExistApiError } from "../src/existApiError.ts";

Deno.test("ExistApiError: is an instance of Error", () => {
   assertInstanceOf(new ExistApiError("get attributes", 401), Error);
});

Deno.test("ExistApiError: name is ExistApiError", () => {
   assertEquals(new ExistApiError("get attributes", 401).name, "ExistApiError");
});

Deno.test("ExistApiError: statusCode is set", () => {
   assertEquals(new ExistApiError("get attributes", 404).statusCode, 404);
});

Deno.test("ExistApiError: message includes operation and status when no body", () => {
   assertEquals(
      new ExistApiError("get attributes", 401).message,
      "get attributes failed with HTTP 401",
   );
});

Deno.test("ExistApiError: message includes detail field from body", () => {
   const err = new ExistApiError("get attributes", 401, { detail: "Not authenticated." });
   assertEquals(err.message, "get attributes failed with HTTP 401: Not authenticated.");
});

Deno.test("ExistApiError: message includes error field when no detail", () => {
   const err = new ExistApiError("update values", 400, { error: "Invalid value." });
   assertEquals(err.message, "update values failed with HTTP 400: Invalid value.");
});

Deno.test("ExistApiError: message includes message field as fallback", () => {
   const err = new ExistApiError("get profile", 500, { message: "Server exploded." });
   assertEquals(err.message, "get profile failed with HTTP 500: Server exploded.");
});

Deno.test("ExistApiError: body with no known field is JSON-stringified in message", () => {
   const err = new ExistApiError("get attributes", 400, { unknown_field: "something" });
   assertEquals(err.message.includes("unknown_field"), true);
});

Deno.test("ExistApiError: body property is accessible", () => {
   const body = { detail: "Not found." };
   assertEquals(new ExistApiError("op", 404, body).body, body);
});

Deno.test("ExistApiError: body is undefined when not provided", () => {
   assertEquals(new ExistApiError("op", 500).body, undefined);
});
