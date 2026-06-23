import type ExistAuthorizer from "./existAuthorizer.ts";
import BaseRequestClient from "../requestClients/_baseRequestClient.ts";
import { ExistApiError } from "../existApiError.ts";

export default abstract class AuthorizedRequestClient extends BaseRequestClient {
   private authorizer: ExistAuthorizer;

   constructor(authorizer: ExistAuthorizer, baseUrl: string) {
      super(baseUrl);
      this.authorizer = authorizer;
   }

   protected async authAndFetch<T>(
      request: Request,
      operation: string,
   ): Promise<T & { statusCode: number }> {
      this.authorizer.authorizeRequest(request);
      const response = await fetch(request);

      let body: Record<string, unknown> | undefined;
      try {
         const data = await response.json();
         if (data !== null && typeof data === "object") {
            body = data as Record<string, unknown>;
         }
      } catch {
         // non-JSON body — leave body undefined
      }

      if (!response.ok) {
         throw new ExistApiError(operation, response.status, body);
      }

      return { ...(body ?? {}), statusCode: response.status } as T & { statusCode: number };
   }
}
