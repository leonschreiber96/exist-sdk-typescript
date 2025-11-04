import type ExistAuthorizer from "./existAuthorizer.ts";
import BaseRequestClient from "../requestClients/_baseRequestClient.ts";

export default abstract class AuthorizedRequestClient extends BaseRequestClient {
   private authorizer: ExistAuthorizer;

   constructor(authorizer: ExistAuthorizer, baseUrl: string) {
      super(baseUrl);
      this.authorizer = authorizer;
   }

   protected async authAndFetch<T>(request: Request): Promise<T & { statusCode: number } | { statusCode: number }> {
      this.authorizer.authorizeRequest(request);
      const response = await fetch(request);

      try {
         const data = await response.json();

         // Only spread when the parsed JSON is a non-null object.
         // Spreading primitives (string/number/boolean) causes TS2698.
         if (data !== null && typeof data === "object") {
            return { ...(data as Record<string, unknown>), statusCode: response.status } as T & { statusCode: number };
         }

         // Non-object response (e.g. plain text or number) — return status only.
         return { statusCode: response.status } as { statusCode: number };
      } catch (_error) {
         return { statusCode: response.status } as { statusCode: number };
      }
   }
}
