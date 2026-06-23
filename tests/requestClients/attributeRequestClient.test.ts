import { assertEquals, assertInstanceOf, assertRejects } from "@std/assert";
import ExistAuthorizer from "../../src/authorization/existAuthorizer.ts";
import AttributeRequestClient from "../../src/requestClients/attributeRequestClient.ts";
import { ExistApiError } from "../../src/existApiError.ts";
import { AttributeTemplateId } from "../../src/model/attributeTemplate.ts";

function makeClient(): AttributeRequestClient {
   const auth = new ExistAuthorizer("id", "secret");
   auth.useTokens("token", "refresh");
   return new AttributeRequestClient(auth, "https://exist.io/api/2");
}

type FetchSpy = {
   lastRequest: Request | null;
   restore: () => void;
};

function spyFetch(responseBody: unknown, status = 200): FetchSpy {
   const spy: FetchSpy = { lastRequest: null, restore: () => {} };
   const original = globalThis.fetch;
   globalThis.fetch = ((req: Request) => {
      spy.lastRequest = req;
      return Promise.resolve(new Response(JSON.stringify(responseBody), { status }));
   }) as typeof fetch;
   spy.restore = () => {
      globalThis.fetch = original;
   };
   return spy;
}

const PAGINATED_EMPTY = { count: 0, next: null, previous: null, results: [] };

// ── getOwned regression ───────────────────────────────────────────────────────

Deno.test("getOwned: calls /attributes/owned/ not /attributes/", async () => {
   const spy = spyFetch(PAGINATED_EMPTY);
   try {
      await makeClient().getOwned();
      const url = new URL(spy.lastRequest!.url);
      assertEquals(url.pathname, "/api/2/attributes/owned/");
   } finally {
      spy.restore();
   }
});

// ── release regression ────────────────────────────────────────────────────────

Deno.test("release: sends [{name}] objects, not raw strings", async () => {
   const spy = spyFetch({ success: [], error: [] });
   try {
      await makeClient().release(["steps", "mood"]);
      const body = await spy.lastRequest!.clone().json();
      assertEquals(body, [{ name: "steps" }, { name: "mood" }]);
   } finally {
      spy.restore();
   }
});

Deno.test("release: method is POST", async () => {
   const spy = spyFetch({ success: [], error: [] });
   try {
      await makeClient().release(["steps"]);
      assertEquals(spy.lastRequest!.method, "POST");
   } finally {
      spy.restore();
   }
});

// ── getMany ───────────────────────────────────────────────────────────────────

Deno.test("getMany: calls /attributes/", async () => {
   const spy = spyFetch(PAGINATED_EMPTY);
   try {
      await makeClient().getMany();
      const url = new URL(spy.lastRequest!.url);
      assertEquals(url.pathname, "/api/2/attributes/");
   } finally {
      spy.restore();
   }
});

Deno.test("getMany: returns paginated response", async () => {
   const spy = spyFetch({ count: 2, next: null, previous: null, results: [{ name: "steps" }, { name: "mood" }] });
   try {
      const result = await makeClient().getMany();
      assertEquals(result.count, 2);
      assertEquals(result.results.length, 2);
   } finally {
      spy.restore();
   }
});

// ── getManyWithValues ─────────────────────────────────────────────────────────

Deno.test("getManyWithValues: calls /attributes/with-values/", async () => {
   const spy = spyFetch(PAGINATED_EMPTY);
   try {
      await makeClient().getManyWithValues();
      const url = new URL(spy.lastRequest!.url);
      assertEquals(url.pathname, "/api/2/attributes/with-values/");
   } finally {
      spy.restore();
   }
});

// ── getValuesForAttribute ─────────────────────────────────────────────────────

Deno.test("getValuesForAttribute: calls /attributes/values/ with attribute param", async () => {
   const spy = spyFetch(PAGINATED_EMPTY);
   try {
      await makeClient().getValuesForAttribute("steps");
      const url = new URL(spy.lastRequest!.url);
      assertEquals(url.pathname, "/api/2/attributes/values/");
      assertEquals(url.searchParams.get("attribute"), "steps");
   } finally {
      spy.restore();
   }
});

// ── getTemplates ──────────────────────────────────────────────────────────────

Deno.test("getTemplates: calls /attributes/templates/", async () => {
   const spy = spyFetch(PAGINATED_EMPTY);
   try {
      await makeClient().getTemplates();
      const url = new URL(spy.lastRequest!.url);
      assertEquals(url.pathname, "/api/2/attributes/templates/");
   } finally {
      spy.restore();
   }
});

// ── acquire ───────────────────────────────────────────────────────────────────

Deno.test("acquire: calls /attributes/acquire/", async () => {
   const spy = spyFetch({ success: [], error: [] });
   try {
      await makeClient().acquire([{ template: AttributeTemplateId.Steps }]);
      const url = new URL(spy.lastRequest!.url);
      assertEquals(url.pathname, "/api/2/attributes/acquire/");
   } finally {
      spy.restore();
   }
});

Deno.test("acquire: returns success and error arrays", async () => {
   const spy = spyFetch({ success: [{ name: "steps", active: true }], error: [] });
   try {
      const result = await makeClient().acquire([{ template: AttributeTemplateId.Steps }]);
      assertEquals(result.success[0].name, "steps");
      assertEquals(result.error.length, 0);
   } finally {
      spy.restore();
   }
});

// ── createNew ─────────────────────────────────────────────────────────────────

Deno.test("createNew: calls /attributes/create/", async () => {
   const spy = spyFetch({ success: [], error: [] });
   try {
      await makeClient().createNew([{ template: AttributeTemplateId.Mood }]);
      const url = new URL(spy.lastRequest!.url);
      assertEquals(url.pathname, "/api/2/attributes/create/");
   } finally {
      spy.restore();
   }
});

// ── updateValues ──────────────────────────────────────────────────────────────

Deno.test("updateValues: calls /attributes/update/", async () => {
   const spy = spyFetch({ success: [], error: [] });
   try {
      await makeClient().updateValues([{ name: "steps", date: "2025-01-01", value: 5000 }]);
      const url = new URL(spy.lastRequest!.url);
      assertEquals(url.pathname, "/api/2/attributes/update/");
   } finally {
      spy.restore();
   }
});

Deno.test("updateValues: body is an array of updates", async () => {
   const spy = spyFetch({ success: [], error: [] });
   try {
      await makeClient().updateValues([
         { name: "steps", date: "2025-01-01", value: 5000 },
         { name: "mood", date: "2025-01-01", value: 7 },
      ]);
      const body = await spy.lastRequest!.clone().json();
      assertEquals(body.length, 2);
      assertEquals(body[0].name, "steps");
      assertEquals(body[1].name, "mood");
   } finally {
      spy.restore();
   }
});

// ── incrementValues ───────────────────────────────────────────────────────────

Deno.test("incrementValues: calls /attributes/increment/", async () => {
   const spy = spyFetch({ success: [], error: [] });
   try {
      await makeClient().incrementValues([{ name: "coffees", date: "2025-01-01", value: 1 }]);
      const url = new URL(spy.lastRequest!.url);
      assertEquals(url.pathname, "/api/2/attributes/increment/");
   } finally {
      spy.restore();
   }
});

// ── error handling ────────────────────────────────────────────────────────────

Deno.test("getMany: throws ExistApiError on 401", async () => {
   const spy = spyFetch({ detail: "Not authenticated." }, 401);
   try {
      await assertRejects(() => makeClient().getMany(), ExistApiError);
   } finally {
      spy.restore();
   }
});

Deno.test("getMany: ExistApiError message includes operation name", async () => {
   const spy = spyFetch({ detail: "Forbidden." }, 403);
   try {
      const err = await makeClient().getMany().catch((e) => e);
      assertInstanceOf(err, ExistApiError);
      assertEquals(err.message.includes("get attributes"), true);
   } finally {
      spy.restore();
   }
});

Deno.test("updateValues: throws ExistApiError on 400", async () => {
   const spy = spyFetch({ detail: "Bad request." }, 400);
   try {
      await assertRejects(
         () => makeClient().updateValues([{ name: "steps", date: "2025-01-01", value: 5000 }]),
         ExistApiError,
      );
   } finally {
      spy.restore();
   }
});
