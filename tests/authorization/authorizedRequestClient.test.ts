import { assertEquals, assertInstanceOf, assertRejects } from "@std/assert";
import AuthorizedRequestClient from "../../src/authorization/authorizedRequestClient.ts";
import ExistAuthorizer from "../../src/authorization/existAuthorizer.ts";
import { ExistApiError } from "../../src/existApiError.ts";

// Concrete subclass to expose the protected method
class TestClient extends AuthorizedRequestClient {
   public callFetch<T>(request: Request, operation: string) {
      return this.authAndFetch<T>(request, operation);
   }
}

function makeClient(): TestClient {
   const authorizer = new ExistAuthorizer("id", "secret");
   authorizer.useTokens("test-token", "test-refresh");
   return new TestClient(authorizer, "https://exist.io/api/2");
}

function mockFetch(body: unknown, status: number): () => void {
   const original = globalThis.fetch;
   globalThis.fetch = (() =>
      Promise.resolve(
         new Response(typeof body === "string" ? body : JSON.stringify(body), {
            status,
            headers: { "Content-Type": "application/json" },
         }),
      )) as typeof fetch;
   return () => {
      globalThis.fetch = original;
   };
}

// ── happy path ────────────────────────────────────────────────────────────────

Deno.test("authAndFetch: returns parsed JSON body merged with statusCode on 200", async () => {
   const restore = mockFetch({ count: 5, results: [] }, 200);
   try {
      const result = await makeClient().callFetch<{ count: number }>(
         new Request("https://exist.io/api/2/attributes/"),
         "get attributes",
      );
      assertEquals((result as unknown as { count: number }).count, 5);
   } finally {
      restore();
   }
});

Deno.test("authAndFetch: sets Authorization header on request", async () => {
   const captured: Request[] = [];
   const original = globalThis.fetch;
   globalThis.fetch = ((req: Request) => {
      captured.push(req);
      return Promise.resolve(new Response(JSON.stringify({}), { status: 200 }));
   }) as typeof fetch;
   try {
      await makeClient().callFetch(new Request("https://exist.io/api/2/test/"), "test");
      assertEquals(captured[0].headers.get("Authorization"), "Bearer test-token");
   } finally {
      globalThis.fetch = original;
   }
});

// ── error handling ────────────────────────────────────────────────────────────

Deno.test("authAndFetch: throws ExistApiError on 401", async () => {
   const restore = mockFetch({ detail: "Authentication credentials were not provided." }, 401);
   try {
      await assertRejects(
         () => makeClient().callFetch(new Request("https://exist.io/api/2/attributes/"), "get attributes"),
         ExistApiError,
         "get attributes failed with HTTP 401",
      );
   } finally {
      restore();
   }
});

Deno.test("authAndFetch: throws ExistApiError on 403", async () => {
   const restore = mockFetch({ detail: "Forbidden." }, 403);
   try {
      await assertRejects(
         () => makeClient().callFetch(new Request("https://exist.io/api/2/attributes/"), "get attributes"),
         ExistApiError,
      );
   } finally {
      restore();
   }
});

Deno.test("authAndFetch: throws ExistApiError on 404", async () => {
   const restore = mockFetch({ detail: "Not found." }, 404);
   try {
      await assertRejects(
         () => makeClient().callFetch(new Request("https://exist.io/api/2/test/"), "get something"),
         ExistApiError,
         "get something failed with HTTP 404: Not found.",
      );
   } finally {
      restore();
   }
});

Deno.test("authAndFetch: throws ExistApiError on 500 with non-JSON body", async () => {
   const original = globalThis.fetch;
   globalThis.fetch = (() =>
      Promise.resolve(new Response("Internal Server Error", { status: 500 }))) as typeof fetch;
   try {
      const err = await makeClient()
         .callFetch(new Request("https://exist.io/api/2/test/"), "test op")
         .catch((e) => e);
      assertInstanceOf(err, ExistApiError);
      assertEquals((err as ExistApiError).statusCode, 500);
   } finally {
      globalThis.fetch = original;
   }
});

Deno.test("authAndFetch: ExistApiError.statusCode matches HTTP status", async () => {
   const restore = mockFetch({ detail: "Gone." }, 410);
   try {
      const err = await makeClient()
         .callFetch(new Request("https://exist.io/api/2/test/"), "op")
         .catch((e) => e);
      assertInstanceOf(err, ExistApiError);
      assertEquals((err as ExistApiError).statusCode, 410);
   } finally {
      restore();
   }
});
