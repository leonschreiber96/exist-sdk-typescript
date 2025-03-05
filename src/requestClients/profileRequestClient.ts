import AuthorizedRequestClient from "../authorization/authorizedRequestClient.ts";
import type ExistAuthorizer from "../authorization/existAuthorizer.ts";
import { getUserProfileRequest } from "../endpoints/profile/getUserProfileRequest.ts";
import type { UserProfile } from "../model/userProfile.ts";

export default class ProfileRequestClient extends AuthorizedRequestClient {
   constructor(authorizer: ExistAuthorizer, baseUrl: string) {
      super(authorizer, baseUrl);
   }

   /**
    * Returns some basic details and personal preferences for the authenticated user. No specific scope is required (see https://developer.exist.io/reference/users/#get-profile-for-user).
    */
   public async getUserProfile(): Promise<UserProfile> {
      const request = getUserProfileRequest(this.baseUrl);
      const response = await this.authAndFetch<UserProfile>(request);

      if (response.statusCode !== 200) {
         throw new Error(`Failed to get user profile: ${response.statusCode}`);
      }

      return response as UserProfile;
   }
}
