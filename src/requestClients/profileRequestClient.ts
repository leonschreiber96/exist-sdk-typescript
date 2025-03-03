import AuthorizedRequestClient from "../authorization/authorizedRequestClient.ts";
import ExistAuthorizer from "../authorization/existAuthorizer.ts";
import { getUserProfileRequest } from "../endpoints/profile/getUserProfileRequest.ts";
import UserProfile from "../model/userProfile.ts";

export default class ProfileRequestClient extends AuthorizedRequestClient {
   constructor(authorizer: ExistAuthorizer, baseUrl: string) {
      super(authorizer, baseUrl);
   }

   /**
    * Returns some basic details and personal preferences for the authenticated user. No specific scope is required (see https://developer.exist.io/reference/users/#get-profile-for-user).
    */
   public async getUserProfile() {
      const request = getUserProfileRequest(this.baseUrl);
      return await this.authAndFetch<UserProfile>(request);
   }
}
