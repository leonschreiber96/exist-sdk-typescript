import { assertEquals, assertThrows } from "@std/assert";
import { getAveragesRequest } from "../../src/endpoints/averages/getAveragesRequest.ts";
import { getCorrelationsRequest } from "../../src/endpoints/correlations/getCorrelationsRequest.ts";
import { getCorrelationRequest } from "../../src/endpoints/correlations/getCorrelationRequest.ts";
import { getInsightsRequest } from "../../src/endpoints/insights/getInsightsRequest.ts";
import { getUserProfileRequest } from "../../src/endpoints/profile/getUserProfileRequest.ts";

const BASE = "https://exist.io/api/2";

// ── getAveragesRequest ────────────────────────────────────────────────────────

Deno.test("getAveragesRequest: builds /averages/ path", () => {
   const url = new URL(getAveragesRequest(BASE).url);
   assertEquals(url.pathname, "/api/2/averages/");
});

Deno.test("getAveragesRequest: dateMin as Date object is serialized", () => {
   const url = new URL(
      getAveragesRequest(BASE, { dateMin: new Date("2025-01-01T00:00:00.000Z") }).url,
   );
   assertEquals(url.searchParams.get("date_min"), "2025-01-01");
});

Deno.test("getAveragesRequest: dateMax as Date object is serialized", () => {
   const url = new URL(
      getAveragesRequest(BASE, { dateMax: new Date("2025-12-31T00:00:00.000Z") }).url,
   );
   assertEquals(url.searchParams.get("date_max"), "2025-12-31");
});

Deno.test("getAveragesRequest: dateMin as string passes through", () => {
   const url = new URL(getAveragesRequest(BASE, { dateMin: "2025-01-01" }).url);
   assertEquals(url.searchParams.get("date_min"), "2025-01-01");
});

Deno.test("getAveragesRequest: invalid dateMin string throws", () => {
   assertThrows(() => getAveragesRequest(BASE, { dateMin: "Jan 1 2025" }), Error, "Invalid date format");
});

Deno.test("getAveragesRequest: groups array is comma-joined", () => {
   const url = new URL(getAveragesRequest(BASE, { groups: ["sleep", "activity"] }).url);
   assertEquals(url.searchParams.get("groups"), "sleep,activity");
});

Deno.test("getAveragesRequest: includeHistorical serializes to '1'", () => {
   const url = new URL(getAveragesRequest(BASE, { includeHistorical: true }).url);
   assertEquals(url.searchParams.get("include_historical"), "1");
});

// ── getCorrelationsRequest ────────────────────────────────────────────────────

Deno.test("getCorrelationsRequest: builds /correlations/ path", () => {
   const url = new URL(getCorrelationsRequest(BASE).url);
   assertEquals(url.pathname, "/api/2/correlations/");
});

Deno.test("getCorrelationsRequest: strong flag serializes to '1'", () => {
   const url = new URL(getCorrelationsRequest(BASE, { strong: true }).url);
   assertEquals(url.searchParams.get("strong"), "1");
});

Deno.test("getCorrelationsRequest: confident flag serializes to '1'", () => {
   const url = new URL(getCorrelationsRequest(BASE, { confident: true }).url);
   assertEquals(url.searchParams.get("confident"), "1");
});

Deno.test("getCorrelationsRequest: attribute filter is appended", () => {
   const url = new URL(getCorrelationsRequest(BASE, { attribute: "steps" }).url);
   assertEquals(url.searchParams.get("attribute"), "steps");
});

Deno.test("getCorrelationsRequest: limit and page are appended", () => {
   const url = new URL(getCorrelationsRequest(BASE, { limit: 20, page: 3 }).url);
   assertEquals(url.searchParams.get("limit"), "20");
   assertEquals(url.searchParams.get("page"), "3");
});

// ── getCorrelationRequest ─────────────────────────────────────────────────────

Deno.test("getCorrelationRequest: builds /correlations/combo/ path", () => {
   const url = new URL(getCorrelationRequest(BASE, ["steps", "mood"]).url);
   assertEquals(url.pathname, "/api/2/correlations/combo/");
});

Deno.test("getCorrelationRequest: both attributes appear as query params", () => {
   const url = new URL(getCorrelationRequest(BASE, ["steps", "sleep"]).url);
   assertEquals(url.searchParams.get("attribute"), "steps");
   assertEquals(url.searchParams.get("attribute2"), "sleep");
});

// ── getInsightsRequest ────────────────────────────────────────────────────────

Deno.test("getInsightsRequest: builds /insights/ path", () => {
   const url = new URL(getInsightsRequest(BASE).url);
   assertEquals(url.pathname, "/api/2/insights/");
});

Deno.test("getInsightsRequest: dateMin as Date is serialized", () => {
   const url = new URL(
      getInsightsRequest(BASE, { dateMin: new Date("2025-03-01T00:00:00.000Z") }).url,
   );
   assertEquals(url.searchParams.get("date_min"), "2025-03-01");
});

Deno.test("getInsightsRequest: dateMin as string passes through", () => {
   const url = new URL(getInsightsRequest(BASE, { dateMin: "2025-03-01" }).url);
   assertEquals(url.searchParams.get("date_min"), "2025-03-01");
});

Deno.test("getInsightsRequest: dateMax as Date is serialized", () => {
   const url = new URL(
      getInsightsRequest(BASE, { dateMax: new Date("2025-03-31T00:00:00.000Z") }).url,
   );
   assertEquals(url.searchParams.get("date_max"), "2025-03-31");
});

Deno.test("getInsightsRequest: invalid dateMin throws", () => {
   assertThrows(() => getInsightsRequest(BASE, { dateMin: "31-03-2025" }), Error, "Invalid date format");
});

Deno.test("getInsightsRequest: priority param is appended", () => {
   const url = new URL(getInsightsRequest(BASE, { priority: 2 }).url);
   assertEquals(url.searchParams.get("priority"), "2");
});

// ── getUserProfileRequest ─────────────────────────────────────────────────────

Deno.test("getUserProfileRequest: builds /profile/ path", () => {
   const url = new URL(getUserProfileRequest(BASE).url);
   assertEquals(url.pathname, "/api/2/profile/");
});

Deno.test("getUserProfileRequest: method is GET", () => {
   assertEquals(getUserProfileRequest(BASE).method, "GET");
});
