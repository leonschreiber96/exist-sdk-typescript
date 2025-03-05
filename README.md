# Exist.io TypeScript API Wrapper

This TypeScript API wrapper provides a convenient interface for interacting with the [Exist.io](https://exist.io/) API. Exist.io is a personal analytics platform that allows users to track and understand various aspects of their lives by integrating data from multiple services.

## Features

- **Authorization**: Manage OAuth2 authentication and authorized requests.
- **Endpoints**: Access various Exist.io API endpoints, including attributes, averages, correlations, insights, and user profiles.
- **Models**: Utilize TypeScript interfaces and types representing Exist's data structures.

## Installation

To install the package for a node.js project using `npm`, run the following command:
```bash
npm install exist-sdk-typescript
```

## Getting Started

### Authorization

The first step is to create a developer client for your application. Follow [this tutorial](https://exist.io/blog/how-to-get-api-token/) to find out how to do this.

To interact with the Exist.io API, you'll need to be authorized via oAuth2 (i.e., you need an access token and ideally a refresh token).
This must be done using the `ExistAuthorizer` class. The authentication tokens can be provided in either of the following ways:

```typescript
const authorizer = new ExistAuthorizer(
   "your-client-id",
   "your-client-secret"
);

// First method: provide tokens directly
authorizer.useTokens("your-access-token", "your-refresh-token");

// Second method: provide a json file where the tokens are saved
// File must look like this: 
//    { 
//       "oAuthToken": "...", 
//       "refreshToken": "..." 
//    }
authorizer.useAuthorizationFile("path/to/file.json");

// Third method: go through the oAuth flow to obtain the token via user confirmation from the server
authorizer.useOAuthFlow(ExistModel.ReadScope.FINANCE, "your-redirect-uri");
```

### 2. Initialize the ExistClient

Use the `ExistClient` class to interact with the API. Initialize it with your access token:

```typescript
import { ExistClient } from 'exist-api-wrapper';

const client = new ExistClient('YOUR_ACCESS_TOKEN');
```

### 3. Fetch User Profile

Retrieve your user profile data:

```typescript
const profile = await client.profile.getUserProfile();
console.log(profile);
```

### 4. Retrieve Attributes

Fetch a list of your attributes:

```typescript
const attributes = await client.attributes.getAttributes();
console.log(attributes);
```

### 5. Update an Attribute

Update the value of an attribute:

```typescript
await client.attributes.updateAttribute('steps', 10000);
```

## Project Structure

The project is organized as follows:

```
.
├── build_npm.ts
├── deno.json
├── deno.lock
├── LICENSE
├── mod.ts
├── README.md
└── src
    ├── authorization
    │   ├── authorizedRequestClient.ts
    │   ├── existAuthorizer.node.ts
    │   └── existAuthorizer.ts
    ├── endpoints
    │   ├── attributes
    │   │   ├── getAttributeRequest.ts
    │   │   ├── getAttributesRequest.ts
    │   │   ├── getAttributesWithValuesRequest.ts
    │   │   ├── getAttributeTemplatesRequest.ts
    │   │   ├── getOwnedAttributes.ts
    │   │   ├── postAquireAttributesRequest.ts
    │   │   ├── postCreateAttributeRequest.ts
    │   │   ├── postIncrementUpdate.ts
    │   │   ├── postReleaseAttributesRequest.ts
    │   │   └── postUpdateAttribute.ts
    │   ├── averages
    │   │   └── getAveragesRequest.ts
    │   ├── correlations
    │   │   ├── getCorrelationRequest.ts
    │   │   └── getCorrelationsRequest.ts
    │   ├── insights
    │   │   └── getInsightsRequest.ts
    │   ├── paginatedRequestParams.ts
    │   └── profile
    │       └── getUserProfileRequest.ts
    ├── existClient.ts
    ├── model
    │   ├── _exports.ts
    │   ├── attribute.ts
    │   ├── attributeAverage.ts
    │   ├── attributeTemplate.ts
    │   ├── attributeValueType.ts
    │   ├── correlation.ts
    │   ├── insight.ts
    │   ├── paginatedResponse.ts
    │   ├── scope.ts
    │   └── userProfile.ts
    └── requestClients
        ├── _baseRequestClient.ts
        ├── attributeRequestClient.ts
        ├── averageRequestClient.ts
        ├── correlationRequestClient.ts
        ├── insightRequestClient.ts
        └── profileRequestClient.ts
```

- **`build_npm.ts`**: Script for building the npm package.
- **`deno.json`**: Configuration file for Deno.
- **`deno.lock`**: Lock file for Deno dependencies.
- **`LICENSE`**: License information.
- **`mod.ts`**: Entry point for the module.
- **`README.md`**: Project documentation.
- **`src/authorization`**: Authorization-related classes and functions.
- **`src/endpoints`**: Modules corresponding to different API endpoints.
- **`src/model`**: TypeScript interfaces and types representing Exist.io data structures.
- **`src/requestClients`**: Clients for making API requests.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`feature/your-feature`).
3. Commit your changes.
4. Push to the branch.
5. Open a Pull Request. 