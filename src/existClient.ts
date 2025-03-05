import type ExistAuthorizer from "./authorization/existAuthorizer.ts";
import AttributeRequestClient from "./requestClients/attributeRequestClient.ts";
import AverageRequestClient from "./requestClients/averageRequestClient.ts";
import CorrelationRequestClient from "./requestClients/correlationRequestClient.ts";
import InsightRequestClient from "./requestClients/insightRequestClient.ts";
import ProfileRequestClient from "./requestClients/profileRequestClient.ts";

const API_URL = "https://exist.io/api/2";

/**
 * The main entry point for interacting with the Exist API.
 * This class contains all available endpoints..
 */
export default class ExistClient {
   /** Contains all endpoints related to [Attributes](https://developer.exist.io/reference/object_types/#attributes). */
   public readonly attributes: AttributeRequestClient;
   /** Contains all endpoints related to [Attribute Averages](https://developer.exist.io/reference/object_types/#averages) */
   public readonly averages: AverageRequestClient;
   /** Contains all endpoints related to [Users](https://developer.exist.io/reference/object_types/#users). */
   public readonly users: ProfileRequestClient;
   /** Contains all endpoints related to [Correlations](https://developer.exist.io/reference/object_types/#correlations). */
   public readonly correlations: CorrelationRequestClient;
   /** Contains all endpoints related to [Insights](https://developer.exist.io/reference/object_types/#insights). */
   public readonly insights: InsightRequestClient;

   constructor(authorizer: ExistAuthorizer) {
      this.attributes = new AttributeRequestClient(authorizer, API_URL);
      this.averages = new AverageRequestClient(authorizer, API_URL);
      this.users = new ProfileRequestClient(authorizer, API_URL);
      this.correlations = new CorrelationRequestClient(authorizer, API_URL);
      this.insights = new InsightRequestClient(authorizer, API_URL);
   }
}
