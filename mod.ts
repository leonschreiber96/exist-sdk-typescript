export { default as ExistClient } from "./src/existClient.ts";
export { default as ExistAuthorizer } from "./src/authorization/existAuthorizer.ts";

export { type Attribute } from "./src/model/attribute.ts";
export { type AttributeAverage } from "./src/model/attributeAverage.ts";
export { type AttributeTemplate, AttributeTemplateId } from "./src/model/attributeTemplate.ts";
export { AttributeValueType } from "./src/model/attributeValueType.ts";
export { type Correlation } from "./src/model/correlation.ts";
export { type Insight } from "./src/model/insight.ts";
export { type Scope, ReadScope, WriteScope } from "./src/model/scope.ts";
export { type UserProfile } from "./src/model/userProfile.ts";

export { type PaginatedRequestParams } from "./src/endpoints/paginatedRequestParams.ts";
export { type GetAttributeParams } from "./src/endpoints/attributes/getAttributeRequest.ts";
export { type GetAttributesParams } from "./src/endpoints/attributes/getAttributesRequest.ts";
export { type GetAttributesWithValuesParams } from "./src/endpoints/attributes/getAttributesWithValuesRequest.ts";
export { type GetAttributeTemplatesParams } from "./src/endpoints/attributes/getAttributeTemplatesRequest.ts";
export { type GetOwnedAttributesParams } from "./src/endpoints/attributes/getOwnedAttributesRequest.ts";
export { type AquireAttributeTemplateParam, type AcquireAttributeByNameParam, type AquireAttributesResponse } from "./src/endpoints/attributes/postAquireAttributesRequest.ts";
export { type CreateTemplatedAttributeParams, type CreateAttributeByNameParams, type CreatettributesResponse } from "./src/endpoints/attributes/postCreateAttributeRequest.ts";
export { type IncrementAttributeValueParam, type IncrementAttributesResponse } from "./src/endpoints/attributes/postIncrementUpdate.ts";
export { type ReleaseAttributesResponse } from "./src/endpoints/attributes/postReleaseAttributesRequest.ts";
export { type UpdateAttributeValueParam,type UpdateAttributesResponse } from "./src/endpoints/attributes/postUpdateAttribute.ts";
export { type GetAveragesParams } from "./src/endpoints/averages/getAveragesRequest.ts";
export { type GetCorrelationsParams } from "./src/endpoints/correlations/getCorrelationsRequest.ts";
export { type GetInsightsParams } from "./src/endpoints/insights/getInsightsRequest.ts";