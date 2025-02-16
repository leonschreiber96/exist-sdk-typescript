import type { Scope } from "../model/scope.ts";

type AuthorizationFile = {
   oAuthToken: string;
   refreshToken: string;
}

type OAuthTokenResponse = {
   access_token: string;
   refresh_token: string;
   token_type: string;
   expires_in: number;
   scope: string;
}

enum AuthStrategy {
   FILE = "file",
   TOKENS = "tokens",
   OAUTH = "oauth",
}

export default class ExistAuthorizer {
   private oAuthServiceUrl: string = "https://exist.io/oauth2";
   private clientId: string;
   private clientSecret: string;
   private oAuthToken: string | null = null;
   private refreshToken: string | null = null;

   constructor(clientId: string, clientSecret: string) {
      this.clientId = clientId;
      this.clientSecret = clientSecret
   }

   public authorizeRequest(request: Request) { request.headers.set("Authorization", `Bearer ${this.oAuthToken}`); }

   public useAuthorizationFile(filePath: string) {
      const file = Deno.readTextFileSync(filePath);

      const data = JSON.parse(file) as AuthorizationFile;
      if (!data.oAuthToken) { throw new Error("Invalid authorization file: missing oAuthToken"); }
      if (!data.refreshToken) { throw new Error("Invalid authorization file: missing refreshToken"); }
      this.oAuthToken = data.oAuthToken;
      this.refreshToken = data.refreshToken;
   }

   public useTokens(oAuthToken: string, refreshToken: string) {
      this.oAuthToken = oAuthToken;
      this.refreshToken = refreshToken;
   }

   public async useOAuthFlow(scope: Scope | Scope[], redirectUri: string) { 
      const authorizationGrant = await this.getOAuthAuthorizationGrant(scope, redirectUri);
      const tokens = await this.getOAuthTokens(authorizationGrant, redirectUri);
      
      this.oAuthToken = tokens.access_token;
      this.refreshToken = tokens.refresh_token;

      console.log("Authorization successful!", tokens);
   }

   private getOAuthTokens(authorizationGrant: string, redirectUri: string): Promise<OAuthTokenResponse> {
      return new Promise((resolve, reject) => {
         const oAuthUrl = `${this.oAuthServiceUrl}/access_token`;

         fetch(oAuthUrl, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
               grant_type: "authorization_code",
               code: authorizationGrant,
               client_id: this.clientId,
               client_secret: this.clientSecret,
               redirect_uri: redirectUri,
            }),
         }).then((response) => {
            if (!response.ok) { reject(`Failed to get OAuth tokens: ${response.status} → ${response.statusText}`); }

            resolve(response.json() as Promise<OAuthTokenResponse>);
         })
      });
   }

   private getOAuthAuthorizationGrant(scope: Scope | Scope[], redirectUri: string): Promise<string> {
      const params = {
         client_id: this.clientId,
         response_type: "code",
         redirect_uri: redirectUri,
         scope: typeof scope === "string" ? scope : scope.join("+"),
      };

      const oAuthUrl = `${this.oAuthServiceUrl}/authorize?${new URLSearchParams(params)}`;
      const redirectUrlObject = new URL(redirectUri);

      if (redirectUrlObject.hostname !== "localhost" && redirectUrlObject.hostname !== "127.0.0.1") {
         throw new Error("Redirect URI must be localhost or 127.0.0.1 for OAuth flow.");
      }

      return new Promise((resolve, reject) => {
         console.log(`Please visit this URL to authorize Exist: ${oAuthUrl}`);
         
         const server = Deno.serve({
            port: +redirectUrlObject.port,
            onListen() {
               console.log("Waiting for authorization via oAuth workflow...");
            },
         }, (req) => {
            const url = new URL(req.url, `http://localhost:8000`);
            const code = url.searchParams.get("code");
            if (code) {
               server.shutdown();
               resolve(code);
               return new Response("Authentication successful! You can close this tab.", {
                  status: 200,
                  headers: { "Content-Type": "text/plain" },
               });
            } else {
               server.shutdown();
               reject();
               return new Response("Missing code.", { status: 400 });
            }
         });
      });
   }
}

export type { AuthorizationFile };
export { AuthStrategy };