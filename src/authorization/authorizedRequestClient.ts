import ExistAuthorizer from "./existAuthorizer.ts";
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
         return { ...data, statusCode: response.status };
      } catch (_error) {
         return { statusCode: response.status } as { statusCode: number };
      }
   }
}
