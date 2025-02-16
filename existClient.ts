import ExistAuthorizer from "./authorization/existAuthorizer.ts";
import type { Attribute } from "./model/attribute.ts";
import type { AttributeAverage } from "./model/attributeAverage.ts";
import type { AttributeTemplate } from "./model/attributeTemplate.ts";
import type { PaginatedResponse } from "./model/paginatedResponse.ts";
import type { UserProfile } from "./model/userProfile.ts";

const API_URL = "https://exist.io/api/2";

export default class ExistClient {
   private authorizer: ExistAuthorizer;

   constructor(authorizer: ExistAuthorizer) {
      this.authorizer = authorizer;
   }

   public async getUserProfile(): Promise<UserProfile> {
      const url = `${API_URL}/accounts/profile/`;
      const data = await this.authAndFetch<UserProfile>(url, "GET");
      return data;
   }

   public async getAverages(parameters?: {
      page?: number;
      limit?: number;
      dateMin?: Date;
      dateMax?: Date;
      groups?: string[];
      attributes?: string[];
      includeHistorical?: boolean;
   }): Promise<PaginatedResponse<AttributeAverage>> {
      const url = `${API_URL}/averages/`;

      const params = new URLSearchParams();
      if (parameters?.page) params.set("page", parameters.page.toString());
      if (parameters?.limit) params.set("limit", parameters.limit.toString());
      if (parameters?.dateMin) {
         params.set("date_min", parameters.dateMin.toISOString());
      }
      if (parameters?.dateMax) {
         params.set("date_max", parameters.dateMax.toISOString());
      }
      if (parameters?.groups) params.set("groups", parameters.groups.join(","));
      if (parameters?.attributes) {
         params.set("attributes", parameters.attributes.join(","));
      }
      if (parameters?.includeHistorical) {
         params.set("include_historical", "true");
      }

      const urlWithParams = `${url}?${params.toString()}`;
      const data = await this.authAndFetch<PaginatedResponse<AttributeAverage>>(
         urlWithParams,
         "GET",
      );
      return data;
   }

   public async getAttributeTemplates(parameters?: {
      page?: number;
      limit?: number;
      includeLowPriority?: boolean;
      groups?: string[];
   }): Promise<PaginatedResponse<AttributeTemplate>> {
      const url = `${API_URL}/attributes/templates/`;

      const params = new URLSearchParams();
      if (parameters?.page) params.set("page", parameters.page.toString());
      if (parameters?.limit) params.set("limit", parameters.limit.toString());
      if (parameters?.includeLowPriority) {
         params.set("include_low_priority", "true");
      }
      if (parameters?.groups) params.set("groups", parameters.groups.join(","));

      const urlWithParams = `${url}?${params.toString()}`;
      const data = await this.authAndFetch<
         PaginatedResponse<AttributeTemplate>
      >(urlWithParams, "GET");
      return data;
   }

   public async getAttributes(parameters?: {
      page?: number;
      limit?: number;
      groups?: string[];
      attributes?: string[];
      excludeCustom?: boolean;
      manual?: boolean;
      includeInactive?: boolean;
      includeLowPriority?: boolean;
      owned?: boolean;
   }): Promise<PaginatedResponse<Attribute>> {
      const url = `${API_URL}/attributes/`;

      const params = new URLSearchParams();
      if (parameters?.page) params.set("page", parameters.page.toString());
      if (parameters?.limit) params.set("limit", parameters.limit.toString());
      if (parameters?.groups) params.set("groups", parameters.groups.join(","));
      if (parameters?.attributes) {
         params.set("attributes", parameters.attributes.join(","));
      }
      if (parameters?.excludeCustom) params.set("exclude_custom", "true");
      if (parameters?.manual) params.set("manual", "true");
      if (parameters?.includeInactive) params.set("include_inactive", "true");
      if (parameters?.includeLowPriority) {
         params.set("include_low_priority", "true");
      }
      if (parameters?.owned) params.set("owned", "true");

      const urlWithParams = `${url}?${params.toString()}`;
      const data = await this.authAndFetch<PaginatedResponse<Attribute>>(
         urlWithParams,
         "GET",
      );
      return data;
   }

   // deno-lint-ignore no-explicit-any
   private async authAndFetch<T>(
      url: string,
      method: string,
      body?: any,
   ): Promise<T> {
      const request = new Request(url, { method, body });
      this.authorizer.authorizeRequest(request);
      const response = await fetch(request);

      if (!response.ok) {
         throw new Error(
            `Failed to fetch data: ${response.status} → ${response.statusText}`,
         );
      } else {
         const json = await response.json();
         return json as T;
      }
   }
}
