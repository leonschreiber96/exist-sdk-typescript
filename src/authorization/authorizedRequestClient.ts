import ExistAuthorizer from "./existAuthorizer.ts";
import BaseRequestClient from "../requestClients/baseRequestClient.ts";

export default abstract class AuthorizedRequestClient extends BaseRequestClient {
   private authorizer: ExistAuthorizer;

   constructor(authorizer: ExistAuthorizer, baseUrl: string) {
      super(baseUrl);
      this.authorizer = authorizer;
   }

   protected async authAndFetch<T>(request: Request): Promise<T> {
      this.authorizer.authorizeRequest(request);
      const response = await fetch(request);

      if (!response.ok) {
         throw new Error(
            `Failed to fetch data: ${response.status} → ${response.statusText}`,
         );
      }

      const json = await response.json();
      return json as T;
   }
}
