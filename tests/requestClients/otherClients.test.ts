import { assertEquals, assertInstanceOf, assertRejects } from "@std/assert";
import ExistAuthorizer from "../../src/authorization/existAuthorizer.ts";
import AverageRequestClient from "../../src/requestClients/averageRequestClient.ts";
import CorrelationRequestClient from "../../src/requestClients/correlationRequestClient.ts";
import InsightRequestClient from "../../src/requestClients/insightRequestClient.ts";
import ProfileRequestClient from "../../src/requestClients/profileRequestClient.ts";
import { ExistApiError } from "../../src/existApiError.ts";

function makeAuth(): ExistAuthorizer {
   const auth = new ExistAuthorizer("id", "secret");
   auth.useTokens("token", "refresh");
   return auth;
}

type FetchSpy = { lastRequest: Request | null; restore: () => void };

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

const BASE = "https://exist.io/api/2";
const PAGINATED_EMPTY = { count: 0, next: null, previous: null, results: [] };

// ── AverageRequestClient ──────────────────────────────────────────────────────

Deno.test("averages.getMany: calls /averages/", async () => {
   const spy = spyFetch(PAGINATED_EMPTY);
   try {
      await new AverageRequestClient(makeAuth(), BASE).getMany();
      assertEquals(new URL(spy.lastRequest!.url).pathname, "/api/2/averages/");
   } finally {
      spy.restore();
   }
});

Deno.test("averages.getMany: returns paginated response", async () => {
   const spy = spyFetch({ count: 1, next: null, previous: null, results: [{ attribute: "steps" }] });
   try {
      const result = await new AverageRequestClient(makeAuth(), BASE).getMany();
      assertEquals(result.count, 1);
   } finally {
      spy.restore();
   }
});

Deno.test("averages.getMany: throws ExistApiError on non-200", async () => {
   const spy = spyFetch({ detail: "Unauthorized." }, 401);
   try {
      await assertRejects(
         () => new AverageRequestClient(makeAuth(), BASE).getMany(),
         ExistApiError,
      );
   } finally {
      spy.restore();
   }
});

// ── CorrelationRequestClient ──────────────────────────────────────────────────

Deno.test("correlations.getMany: calls /correlations/", async () => {
   const spy = spyFetch(PAGINATED_EMPTY);
   try {
      await new CorrelationRequestClient(makeAuth(), BASE).getMany();
      assertEquals(new URL(spy.lastRequest!.url).pathname, "/api/2/correlations/");
   } finally {
      spy.restore();
   }
});

Deno.test("correlations.getMany: passes filter params to URL", async () => {
   const spy = spyFetch(PAGINATED_EMPTY);
   try {
      await new CorrelationRequestClient(makeAuth(), BASE).getMany({ strong: true, attribute: "steps" });
      const url = new URL(spy.lastRequest!.url);
      assertEquals(url.searchParams.get("strong"), "1");
      assertEquals(url.searchParams.get("attribute"), "steps");
   } finally {
      spy.restore();
   }
});

Deno.test("correlations.getSingle: calls /correlations/combo/ with both attributes", async () => {
   const spy = spyFetch({ attribute: "steps", attribute2: "mood", value: 0.3 });
   try {
      await new CorrelationRequestClient(makeAuth(), BASE).getSingle("steps", "mood");
      const url = new URL(spy.lastRequest!.url);
      assertEquals(url.pathname, "/api/2/correlations/combo/");
      assertEquals(url.searchParams.get("attribute"), "steps");
      assertEquals(url.searchParams.get("attribute2"), "mood");
   } finally {
      spy.restore();
   }
});

Deno.test("correlations.getSingle: returns null when no correlation exists (404)", async () => {
   const spy = spyFetch({ detail: "not_found" }, 404);
   try {
      const result = await new CorrelationRequestClient(makeAuth(), BASE).getSingle("caffeine", "energy_level");
      assertEquals(result, null);
   } finally {
      spy.restore();
   }
});

Deno.test("correlations.getSingle: still throws ExistApiError on 401", async () => {
   const spy = spyFetch({ detail: "Not authenticated." }, 401);
   try {
      await assertRejects(
         () => new CorrelationRequestClient(makeAuth(), BASE).getSingle("steps", "mood"),
         ExistApiError,
      );
   } finally {
      spy.restore();
   }
});

// ── InsightRequestClient ──────────────────────────────────────────────────────

Deno.test("insights.getMany: calls /insights/", async () => {
   const spy = spyFetch(PAGINATED_EMPTY);
   try {
      await new InsightRequestClient(makeAuth(), BASE).getMany();
      assertEquals(new URL(spy.lastRequest!.url).pathname, "/api/2/insights/");
   } finally {
      spy.restore();
   }
});

Deno.test("insights.getMany: passes date params to URL", async () => {
   const spy = spyFetch(PAGINATED_EMPTY);
   try {
      await new InsightRequestClient(makeAuth(), BASE).getMany({
         dateMin: "2025-01-01",
         dateMax: "2025-01-31",
      });
      const url = new URL(spy.lastRequest!.url);
      assertEquals(url.searchParams.get("date_min"), "2025-01-01");
      assertEquals(url.searchParams.get("date_max"), "2025-01-31");
   } finally {
      spy.restore();
   }
});

Deno.test("insights.getMany: throws ExistApiError on 403", async () => {
   const spy = spyFetch({ detail: "Forbidden." }, 403);
   try {
      await assertRejects(
         () => new InsightRequestClient(makeAuth(), BASE).getMany(),
         ExistApiError,
      );
   } finally {
      spy.restore();
   }
});

// ── ProfileRequestClient ──────────────────────────────────────────────────────

Deno.test("users.getUserProfile: calls /profile/", async () => {
   const spy = spyFetch({ username: "testuser", timezone: "UTC" });
   try {
      await new ProfileRequestClient(makeAuth(), BASE).getUserProfile();
      assertEquals(new URL(spy.lastRequest!.url).pathname, "/api/2/profile/");
   } finally {
      spy.restore();
   }
});

Deno.test("users.getUserProfile: returns profile data", async () => {
   const spy = spyFetch({ username: "leon", timezone: "Europe/Berlin", trial: false });
   try {
      const result = await new ProfileRequestClient(makeAuth(), BASE).getUserProfile();
      assertEquals((result as unknown as { username: string }).username, "leon");
   } finally {
      spy.restore();
   }
});

Deno.test("users.getUserProfile: throws ExistApiError on 401", async () => {
   const spy = spyFetch({ detail: "Not authenticated." }, 401);
   try {
      await assertRejects(
         () => new ProfileRequestClient(makeAuth(), BASE).getUserProfile(),
         ExistApiError,
         "get user profile failed with HTTP 401",
      );
   } finally {
      spy.restore();
   }
});

// ── ExistClient integration ───────────────────────────────────────────────────

Deno.test("ExistClient: Authorization header is sent on every request", async () => {
   const captured: string[] = [];
   const original = globalThis.fetch;
   globalThis.fetch = ((req: Request) => {
      captured.push(req.headers.get("Authorization") ?? "none");
      return Promise.resolve(new Response(JSON.stringify(PAGINATED_EMPTY), { status: 200 }));
   }) as typeof fetch;

   try {
      const auth = new ExistAuthorizer("id", "secret");
      auth.useTokens("my-sdk-token", "ref");
      const { default: ExistClient } = await import("../../src/existClient.ts");
      const client = new ExistClient(auth);
      await client.attributes.getMany();
      await client.averages.getMany();
      assertEquals(captured.every((h) => h === "Bearer my-sdk-token"), true);
   } finally {
      globalThis.fetch = original;
   }
});
