import type { Scope } from "../model/scope.ts";
import http from "node:http";

type OAuthTokenResponse = {
   access_token: string;
   refresh_token: string;
   token_type: string;
   expires_in: number;
   scope: string;
};

/**
 * Handles authorization with the Exist API using OAuth2.
 * Pass an instance of this class to an Exist API client to authorize all of its requests.
 */
export default class ExistAuthorizer {
   private oAuthServiceUrl: string = "https://exist.io/oauth2";
   private clientId: string;
   private clientSecret: string;
   private oAuthToken: string | null = null;
   private refreshToken: string | null = null;
   private expiresIn: number | null = null;
   private scope: Scope | Scope[] | null = null;
   private logger: (message: string) => void;

   constructor(clientId: string, clientSecret: string, logger?: (message: string) => void) {
      this.clientId = clientId;
      this.clientSecret = clientSecret;
      this.logger = logger ?? console.log;
   }

   /**
    * Authorize the provided request with the current OAuth token.
    * @param request The request to authorize.
    */
   public authorizeRequest(request: Request): void {
      if (!this.oAuthToken) {
         throw new Error(
            "No OAuth token available. Call useTokens(), useAuthorizationFile(), or useOAuthFlow() before making requests.",
         );
      }
      request.headers.set("Authorization", `Bearer ${this.oAuthToken}`);
   }

   /**
    * Use the provided authorization file for authorization.
    * @param filePath The path to the authorization file to use for authorization.
    */
   public useAuthorizationFile(filePath: string): void {
      const file = Deno.readTextFileSync(filePath);

      const data = JSON.parse(file) as OAuthTokenResponse;
      if (!data.access_token) {
         throw new Error("Invalid authorization file: missing access_token");
      }
      if (!data.refresh_token) {
         throw new Error("Invalid authorization file: missing refresh_token");
      }
      this.oAuthToken = data.access_token;
      this.refreshToken = data.refresh_token;
      this.scope = data.scope?.split("+") as Scope | Scope[];
      this.expiresIn = data.expires_in;
   }

   /**
    * Use the provided OAuth token and refresh token for authorization.
    * @param oAuthToken The OAuth token to use for authorization.
    * @param refreshToken The refresh token to use when the OAuth token expires.
    */
   public useTokens(oAuthToken: string, refreshToken: string): void {
      this.oAuthToken = oAuthToken;
      this.refreshToken = refreshToken;
   }

   /**
    * Use the OAuth flow to authorize with Exist. Prints the authorization URL via the configured logger,
    * waits for the user to complete the flow, then stores and returns the resulting tokens.
    * @param scope List of scopes to request authorization for (see https://developer.exist.io/reference/authentication/oauth2/#scopes).
    * @param redirectUri The URI to send the authorization grant to. Should match the redirect URI set in the Exist developer client settings.
    * @param [callback] *Optional* A callback function to handle the OAuth token response (e.g., to save the tokens to a file).
    * @returns The OAuth token response containing the access token, refresh token, and other details.
    */
   public async useOAuthFlow(
      scope: Scope | Scope[],
      redirectUri: string,
      callback?: (grant: OAuthTokenResponse) => void,
   ): Promise<OAuthTokenResponse> {
      const authorizationGrant = await this.getOAuthAuthorizationGrant(scope, redirectUri);
      const tokens = (await this.getOAuthTokens(authorizationGrant, redirectUri)) as OAuthTokenResponse;

      this.oAuthToken = tokens.access_token;
      this.refreshToken = tokens.refresh_token;
      this.scope = tokens.scope.split("+") as Scope | Scope[];
      this.expiresIn = tokens.expires_in;

      if (callback) {
         callback(tokens);
      }

      return tokens;
   }

   /**
    * Refresh the OAuth token using the refresh token. Updates the stored tokens and returns the new token response.
    * Don't forget to save the new tokens!
    * @returns The new OAuth token response containing the updated access token, refresh token, and other details.
    */
   public async refreshOAuthToken(): Promise<OAuthTokenResponse> {
      const oAuthUrl = `${this.oAuthServiceUrl}/access_token`;

      const response = await fetch(oAuthUrl, {
         method: "POST",
         headers: { "Content-Type": "application/x-www-form-urlencoded" },
         body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: this.refreshToken as string,
            client_id: this.clientId,
            client_secret: this.clientSecret,
         }),
      });
      const data = (await response.json()) as OAuthTokenResponse;

      this.oAuthToken = data.access_token;
      this.refreshToken = data.refresh_token;
      this.expiresIn = data.expires_in;
      this.scope = data.scope?.split("+") as Scope | Scope[];

      return data;
   }

   /**
    * Dump the current authorization data to a file.
    * @param filePath The path to the file to dump the authorization data to.
    */
   public dumpAuthorizationToFile(filePath: string): void {
      if (!this.oAuthToken || !this.refreshToken || !this.scope || !this.expiresIn) {
         throw new Error("Missing authorization data to dump to file.");
      }

      const data: OAuthTokenResponse = {
         access_token: this.oAuthToken,
         refresh_token: this.refreshToken,
         token_type: "Bearer",
         expires_in: this.expiresIn,
         scope: typeof this.scope === "string" ? this.scope : this.scope.join("+"),
      };

      Deno.writeTextFileSync(filePath, JSON.stringify(data, null, 3));
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
            if (!response.ok) {
               reject(`Failed to get OAuth tokens: ${response.status} → ${response.statusText}`);
            }

            response.json().then((data) => {
               resolve(data as OAuthTokenResponse);
            });
         });
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

      if (!["localhost", "127.0.0.1"].includes(redirectUrlObject.hostname)) {
         throw new Error("Redirect URI must be localhost or 127.0.0.1 for OAuth flow.");
      }

      return new Promise((resolve, reject) => {
         this.logger(`Please visit this URL to authorize Exist: ${oAuthUrl.replace("%2B", "+")}`);

         const server = http.createServer((req, res) => {
            const url = new URL(req.url ?? "", `http://localhost`);
            const code = url.searchParams.get("code");

            if (code) {
               res.writeHead(200, { "Content-Type": "text/plain" });
               res.end("Authentication successful! You can close this tab.");
               server.close();
               resolve(code);
            } else {
               res.writeHead(400, { "Content-Type": "text/plain" });
               res.end("Missing code.");
               server.close();
               reject(new Error("Authorization code not found in request"));
            }
         });

         server.listen(parseInt(redirectUrlObject.port), () => {
            this.logger("Waiting for authorization via OAuth workflow...");
         });
      });
   }
}

export type { OAuthTokenResponse };
