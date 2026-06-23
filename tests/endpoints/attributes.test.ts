import { assertEquals, assertThrows } from "@std/assert";
import { getAttributeRequest } from "../../src/endpoints/attributes/getAttributeRequest.ts";
import { getAttributesRequest } from "../../src/endpoints/attributes/getAttributesRequest.ts";
import { getAttributesWithValuesRequest } from "../../src/endpoints/attributes/getAttributesWithValuesRequest.ts";
import { getAttributeTemplatesRequest } from "../../src/endpoints/attributes/getAttributeTemplatesRequest.ts";
import { getOwnedAttributesRequest } from "../../src/endpoints/attributes/getOwnedAttributesRequest.ts";
import { acquireAttributesRequest } from "../../src/endpoints/attributes/postAcquireAttributesRequest.ts";
import { releaseAttributesRequest } from "../../src/endpoints/attributes/postReleaseAttributesRequest.ts";
import { createAttributeRequest } from "../../src/endpoints/attributes/postCreateAttributeRequest.ts";
import { updateAttributeRequest } from "../../src/endpoints/attributes/postUpdateAttribute.ts";
import { incrementAttributeRequest } from "../../src/endpoints/attributes/postIncrementUpdate.ts";
import { AttributeTemplateId } from "../../src/model/attributeTemplate.ts";
import { AttributeValueType } from "../../src/model/attributeValueType.ts";

const BASE = "https://exist.io/api/2";

// ── getAttributeRequest ───────────────────────────────────────────────────────

Deno.test("getAttributeRequest: builds /attributes/values/ with attribute param", () => {
   const url = new URL(getAttributeRequest(BASE, "steps").url);
   assertEquals(url.pathname, "/api/2/attributes/values/");
   assertEquals(url.searchParams.get("attribute"), "steps");
});

Deno.test("getAttributeRequest: no extra params when none provided", () => {
   const url = new URL(getAttributeRequest(BASE, "mood").url);
   assertEquals(url.searchParams.get("limit"), null);
   assertEquals(url.searchParams.get("page"), null);
});

Deno.test("getAttributeRequest: limit and page are appended", () => {
   const url = new URL(getAttributeRequest(BASE, "steps", { limit: 50, page: 2 }).url);
   assertEquals(url.searchParams.get("limit"), "50");
   assertEquals(url.searchParams.get("page"), "2");
});

Deno.test("getAttributeRequest: dateMax as Date object is serialized to YYYY-MM-DD", () => {
   const url = new URL(
      getAttributeRequest(BASE, "steps", { dateMax: new Date("2025-06-01T00:00:00.000Z") }).url,
   );
   assertEquals(url.searchParams.get("date_max"), "2025-06-01");
});

Deno.test("getAttributeRequest: dateMax as string is passed through", () => {
   const url = new URL(getAttributeRequest(BASE, "steps", { dateMax: "2025-06-01" }).url);
   assertEquals(url.searchParams.get("date_max"), "2025-06-01");
});

Deno.test("getAttributeRequest: invalid dateMax string throws", () => {
   assertThrows(() => getAttributeRequest(BASE, "steps", { dateMax: "01/06/2025" }), Error, "Invalid date format");
});

// ── getAttributesRequest ──────────────────────────────────────────────────────

Deno.test("getAttributesRequest: builds /attributes/ path", () => {
   const url = new URL(getAttributesRequest(BASE).url);
   assertEquals(url.pathname, "/api/2/attributes/");
});

Deno.test("getAttributesRequest: groups array is comma-joined", () => {
   const url = new URL(getAttributesRequest(BASE, { groups: ["activity", "sleep"] }).url);
   assertEquals(url.searchParams.get("groups"), "activity,sleep");
});

Deno.test("getAttributesRequest: attributes array is comma-joined", () => {
   const url = new URL(getAttributesRequest(BASE, { attributes: ["steps", "mood"] }).url);
   assertEquals(url.searchParams.get("attributes"), "steps,mood");
});

Deno.test("getAttributesRequest: boolean flags serialize to '1'", () => {
   const url = new URL(
      getAttributesRequest(BASE, {
         excludeCustom: true,
         manual: true,
         includeInactive: true,
         includeLowPriority: true,
         owned: true,
      }).url,
   );
   assertEquals(url.searchParams.get("exclude_custom"), "1");
   assertEquals(url.searchParams.get("manual"), "1");
   assertEquals(url.searchParams.get("include_inactive"), "1");
   assertEquals(url.searchParams.get("include_low_priority"), "1");
   assertEquals(url.searchParams.get("owned"), "1");
});

Deno.test("getAttributesRequest: false booleans are not appended", () => {
   const url = new URL(getAttributesRequest(BASE, { excludeCustom: false }).url);
   assertEquals(url.searchParams.get("exclude_custom"), null);
});

// ── getAttributesWithValuesRequest ────────────────────────────────────────────

Deno.test("getAttributesWithValuesRequest: builds /attributes/with-values/ path", () => {
   const url = new URL(getAttributesWithValuesRequest(BASE).url);
   assertEquals(url.pathname, "/api/2/attributes/with-values/");
});

Deno.test("getAttributesWithValuesRequest: days param is appended", () => {
   const url = new URL(getAttributesWithValuesRequest(BASE, { days: 7 }).url);
   assertEquals(url.searchParams.get("days"), "7");
});

Deno.test("getAttributesWithValuesRequest: dateMax as Date is serialized", () => {
   const url = new URL(
      getAttributesWithValuesRequest(BASE, { dateMax: new Date("2025-01-31T00:00:00.000Z") }).url,
   );
   assertEquals(url.searchParams.get("date_max"), "2025-01-31");
});

Deno.test("getAttributesWithValuesRequest: dateMax as string is passed through", () => {
   const url = new URL(getAttributesWithValuesRequest(BASE, { dateMax: "2025-01-31" }).url);
   assertEquals(url.searchParams.get("date_max"), "2025-01-31");
});

Deno.test("getAttributesWithValuesRequest: templates array is comma-joined", () => {
   const url = new URL(
      getAttributesWithValuesRequest(BASE, { templates: ["steps", "mood"] }).url,
   );
   assertEquals(url.searchParams.get("templates"), "steps,mood");
});

// ── getAttributeTemplatesRequest ──────────────────────────────────────────────

Deno.test("getAttributeTemplatesRequest: builds /attributes/templates/ path", () => {
   const url = new URL(getAttributeTemplatesRequest(BASE).url);
   assertEquals(url.pathname, "/api/2/attributes/templates/");
});

Deno.test("getAttributeTemplatesRequest: includeLowPriority serializes to '1'", () => {
   const url = new URL(getAttributeTemplatesRequest(BASE, { includeLowPriority: true }).url);
   assertEquals(url.searchParams.get("include_low_priority"), "1");
});

// ── getOwnedAttributesRequest ─────────────────────────────────────────────────

Deno.test("getOwnedAttributesRequest: builds /attributes/owned/ (not /attributes/)", () => {
   const url = new URL(getOwnedAttributesRequest(BASE).url);
   assertEquals(url.pathname, "/api/2/attributes/owned/");
});

Deno.test("getOwnedAttributesRequest: boolean flags serialize to '1' (not 'true')", () => {
   const url = new URL(
      getOwnedAttributesRequest(BASE, {
         excludeCustom: true,
         manual: true,
         includeInactive: true,
         includeLowPriority: true,
      }).url,
   );
   assertEquals(url.searchParams.get("exclude_custom"), "1");
   assertEquals(url.searchParams.get("manual"), "1");
   assertEquals(url.searchParams.get("include_inactive"), "1");
   assertEquals(url.searchParams.get("include_low_priority"), "1");
});

// ── acquireAttributesRequest ──────────────────────────────────────────────────

Deno.test("acquireAttributesRequest: method is POST", () => {
   assertEquals(acquireAttributesRequest(BASE, [{ template: AttributeTemplateId.Steps }]).method, "POST");
});

Deno.test("acquireAttributesRequest: builds /attributes/acquire/ path", () => {
   const url = new URL(acquireAttributesRequest(BASE, []).url);
   assertEquals(url.pathname, "/api/2/attributes/acquire/");
});

Deno.test("acquireAttributesRequest: body contains template params", async () => {
   const req = acquireAttributesRequest(BASE, [
      { template: AttributeTemplateId.Steps, manual: false },
   ]);
   const body = await req.json();
   assertEquals(body[0].template, "steps");
   assertEquals(body[0].manual, false);
});

Deno.test("acquireAttributesRequest: body contains name for non-templated acquire", async () => {
   const req = acquireAttributesRequest(BASE, [{ name: "my_custom_attr" }]);
   const body = await req.json();
   assertEquals(body[0].name, "my_custom_attr");
});

// ── releaseAttributesRequest ──────────────────────────────────────────────────

Deno.test("releaseAttributesRequest: method is POST", () => {
   assertEquals(releaseAttributesRequest(BASE, ["steps"]).method, "POST");
});

Deno.test("releaseAttributesRequest: builds /attributes/release/ path", () => {
   const url = new URL(releaseAttributesRequest(BASE, []).url);
   assertEquals(url.pathname, "/api/2/attributes/release/");
});

Deno.test("releaseAttributesRequest: body is array of {name} objects, not raw strings", async () => {
   const req = releaseAttributesRequest(BASE, ["steps", "mood"]);
   const body = await req.json();
   assertEquals(body, [{ name: "steps" }, { name: "mood" }]);
});

// ── createAttributeRequest ────────────────────────────────────────────────────

Deno.test("createAttributeRequest: method is POST", () => {
   assertEquals(createAttributeRequest(BASE, [{ template: AttributeTemplateId.Mood }]).method, "POST");
});

Deno.test("createAttributeRequest: builds /attributes/create/ path", () => {
   const url = new URL(createAttributeRequest(BASE, []).url);
   assertEquals(url.pathname, "/api/2/attributes/create/");
});

Deno.test("createAttributeRequest: body contains custom attribute fields", async () => {
   const req = createAttributeRequest(BASE, [{
      label: "My Metric",
      group: "health",
      value_type: AttributeValueType.QUANTITY,
   }]);
   const body = await req.json();
   assertEquals(body[0].label, "My Metric");
   assertEquals(body[0].group, "health");
   assertEquals(body[0].value_type, AttributeValueType.QUANTITY);
});

// ── updateAttributeRequest ────────────────────────────────────────────────────

Deno.test("updateAttributeRequest: method is POST", () => {
   assertEquals(
      updateAttributeRequest(BASE, [{ name: "steps", date: "2025-01-01", value: 5000 }]).method,
      "POST",
   );
});

Deno.test("updateAttributeRequest: builds /attributes/update/ path", () => {
   const url = new URL(updateAttributeRequest(BASE, []).url);
   assertEquals(url.pathname, "/api/2/attributes/update/");
});

Deno.test("updateAttributeRequest: serializes Date object to YYYY-MM-DD in body", async () => {
   const req = updateAttributeRequest(BASE, [{
      name: "steps",
      date: new Date("2025-03-15T00:00:00.000Z"),
      value: 8000,
   }]);
   const body = await req.json();
   assertEquals(body[0].date, "2025-03-15");
});

Deno.test("updateAttributeRequest: passes through YYYY-MM-DD string date", async () => {
   const req = updateAttributeRequest(BASE, [{ name: "steps", date: "2025-03-15", value: 8000 }]);
   const body = await req.json();
   assertEquals(body[0].date, "2025-03-15");
});

Deno.test("updateAttributeRequest: throws on invalid date string", () => {
   assertThrows(
      () => updateAttributeRequest(BASE, [{ name: "steps", date: "March 15 2025", value: 100 }]),
      Error,
      "Invalid date format",
   );
});

Deno.test("updateAttributeRequest: body preserves name and value", async () => {
   const req = updateAttributeRequest(BASE, [{ name: "mood", date: "2025-01-01", value: 7 }]);
   const body = await req.json();
   assertEquals(body[0].name, "mood");
   assertEquals(body[0].value, 7);
});

// ── incrementAttributeRequest ─────────────────────────────────────────────────

Deno.test("incrementAttributeRequest: method is POST", () => {
   assertEquals(
      incrementAttributeRequest(BASE, [{ name: "coffees", date: "2025-01-01", value: 1 }]).method,
      "POST",
   );
});

Deno.test("incrementAttributeRequest: builds /attributes/increment/ path", () => {
   const url = new URL(incrementAttributeRequest(BASE, []).url);
   assertEquals(url.pathname, "/api/2/attributes/increment/");
});

Deno.test("incrementAttributeRequest: serializes Date to YYYY-MM-DD", async () => {
   const req = incrementAttributeRequest(BASE, [{
      name: "coffees",
      date: new Date("2025-06-10T00:00:00.000Z"),
      value: 2,
   }]);
   const body = await req.json();
   assertEquals(body[0].date, "2025-06-10");
});

Deno.test("incrementAttributeRequest: throws on invalid date string", () => {
   assertThrows(
      () => incrementAttributeRequest(BASE, [{ name: "coffees", date: "bad-date", value: 1 }]),
      Error,
      "Invalid date format",
   );
});
