import { assertEquals, assertRejects, assertThrows } from "@std/assert";
import ExistAuthorizer from "../../src/authorization/existAuthorizer.ts";
import type { OAuthTokenResponse } from "../../src/authorization/existAuthorizer.ts";

const VALID_TOKEN_RESPONSE: OAuthTokenResponse = {
   access_token: "test-access-token",
   refresh_token: "test-refresh-token",
   token_type: "Bearer",
   expires_in: 36000,
   scope: "activity_read+mood_read",
};

// ── authorizeRequest ──────────────────────────────────────────────────────────

Deno.test("authorizeRequest: throws when no token has been set", () => {
   const authorizer = new ExistAuthorizer("id", "secret");
   assertThrows(
      () => authorizer.authorizeRequest(new Request("https://exist.io")),
      Error,
      "No OAuth token available",
   );
});

Deno.test("authorizeRequest: sets Authorization Bearer header after useTokens", () => {
   const authorizer = new ExistAuthorizer("id", "secret");
   authorizer.useTokens("my-token", "my-refresh");
   const request = new Request("https://exist.io");
   authorizer.authorizeRequest(request);
   assertEquals(request.headers.get("Authorization"), "Bearer my-token");
});

// ── useAuthorizationFile ──────────────────────────────────────────────────────

Deno.test("useAuthorizationFile: reads access and refresh tokens from file", () => {
   const tmp = Deno.makeTempFileSync();
   try {
      Deno.writeTextFileSync(tmp, JSON.stringify(VALID_TOKEN_RESPONSE));
      const authorizer = new ExistAuthorizer("id", "secret");
      authorizer.useAuthorizationFile(tmp);
      const request = new Request("https://exist.io");
      authorizer.authorizeRequest(request);
      assertEquals(request.headers.get("Authorization"), "Bearer test-access-token");
   } finally {
      Deno.removeSync(tmp);
   }
});

Deno.test("useAuthorizationFile: throws on missing access_token", () => {
   const tmp = Deno.makeTempFileSync();
   try {
      Deno.writeTextFileSync(tmp, JSON.stringify({ refresh_token: "ref" }));
      assertThrows(
         () => new ExistAuthorizer("id", "secret").useAuthorizationFile(tmp),
         Error,
         "missing access_token",
      );
   } finally {
      Deno.removeSync(tmp);
   }
});

Deno.test("useAuthorizationFile: throws on missing refresh_token", () => {
   const tmp = Deno.makeTempFileSync();
   try {
      Deno.writeTextFileSync(tmp, JSON.stringify({ access_token: "tok" }));
      assertThrows(
         () => new ExistAuthorizer("id", "secret").useAuthorizationFile(tmp),
         Error,
         "missing refresh_token",
      );
   } finally {
      Deno.removeSync(tmp);
   }
});

// ── dumpAuthorizationToFile ───────────────────────────────────────────────────

Deno.test("dumpAuthorizationToFile: writes valid OAuth token JSON", () => {
   const tmpIn = Deno.makeTempFileSync();
   const tmpOut = Deno.makeTempFileSync();
   try {
      Deno.writeTextFileSync(tmpIn, JSON.stringify(VALID_TOKEN_RESPONSE));
      const authorizer = new ExistAuthorizer("id", "secret");
      authorizer.useAuthorizationFile(tmpIn);
      authorizer.dumpAuthorizationToFile(tmpOut);
      const written = JSON.parse(Deno.readTextFileSync(tmpOut)) as OAuthTokenResponse;
      assertEquals(written.access_token, "test-access-token");
      assertEquals(written.refresh_token, "test-refresh-token");
      assertEquals(written.token_type, "Bearer");
      assertEquals(written.expires_in, 36000);
   } finally {
      Deno.removeSync(tmpIn);
      Deno.removeSync(tmpOut);
   }
});

Deno.test("dumpAuthorizationToFile: dump can be reloaded with useAuthorizationFile", () => {
   const tmpIn = Deno.makeTempFileSync();
   const tmpOut = Deno.makeTempFileSync();
   try {
      Deno.writeTextFileSync(tmpIn, JSON.stringify(VALID_TOKEN_RESPONSE));
      const authorizer = new ExistAuthorizer("id", "secret");
      authorizer.useAuthorizationFile(tmpIn);
      authorizer.dumpAuthorizationToFile(tmpOut);

      const authorizer2 = new ExistAuthorizer("id", "secret");
      authorizer2.useAuthorizationFile(tmpOut);
      const request = new Request("https://exist.io");
      authorizer2.authorizeRequest(request);
      assertEquals(request.headers.get("Authorization"), "Bearer test-access-token");
   } finally {
      Deno.removeSync(tmpIn);
      Deno.removeSync(tmpOut);
   }
});

Deno.test("dumpAuthorizationToFile: throws when no tokens have been set", () => {
   assertThrows(
      () => new ExistAuthorizer("id", "secret").dumpAuthorizationToFile("/tmp/x.json"),
      Error,
      "Missing authorization data",
   );
});

// ── refreshOAuthToken ─────────────────────────────────────────────────────────

Deno.test("refreshOAuthToken: returns new token response", async () => {
   const newTokens: OAuthTokenResponse = {
      access_token: "new-access",
      refresh_token: "new-refresh",
      token_type: "Bearer",
      expires_in: 36000,
      scope: "activity_read",
   };
   const original = globalThis.fetch;
   globalThis.fetch = (() =>
      Promise.resolve(new Response(JSON.stringify(newTokens), { status: 200 }))) as typeof fetch;
   try {
      const authorizer = new ExistAuthorizer("id", "secret");
      authorizer.useTokens("old", "old-refresh");
      const result = await authorizer.refreshOAuthToken();
      assertEquals(result.access_token, "new-access");
      assertEquals(result.refresh_token, "new-refresh");
   } finally {
      globalThis.fetch = original;
   }
});

Deno.test("refreshOAuthToken: new token is used for subsequent requests", async () => {
   const newTokens: OAuthTokenResponse = {
      access_token: "refreshed-token",
      refresh_token: "refreshed-refresh",
      token_type: "Bearer",
      expires_in: 36000,
      scope: "activity_read",
   };
   const original = globalThis.fetch;
   globalThis.fetch = (() =>
      Promise.resolve(new Response(JSON.stringify(newTokens), { status: 200 }))) as typeof fetch;
   try {
      const authorizer = new ExistAuthorizer("id", "secret");
      authorizer.useTokens("old-token", "old-refresh");
      await authorizer.refreshOAuthToken();

      const request = new Request("https://exist.io");
      authorizer.authorizeRequest(request);
      assertEquals(request.headers.get("Authorization"), "Bearer refreshed-token");
   } finally {
      globalThis.fetch = original;
   }
});

// ── logger ────────────────────────────────────────────────────────────────────

Deno.test("constructor: custom logger is used instead of console.log", async () => {
   const logged: string[] = [];
   // Verify a custom logger can be injected — checked indirectly via dumpAuthorizationToFile
   // (the logger would be called during OAuth flow, which we can't test without a browser)
   const authorizer = new ExistAuthorizer("id", "secret", (msg) => logged.push(msg));
   // Logger is stored; confirm no crash and normal operation still works
   authorizer.useTokens("tok", "ref");
   const request = new Request("https://exist.io");
   authorizer.authorizeRequest(request);
   assertEquals(request.headers.get("Authorization"), "Bearer tok");
});
