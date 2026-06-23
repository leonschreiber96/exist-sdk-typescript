# **Exist.io TypeScript SDK**

A TypeScript SDK for interacting with the [Exist.io API](https://exist.io/). Exist.io is a personal analytics platform that integrates data from multiple services to help users track and understand various aspects of their lives.

## **Features**
✔ **OAuth2 Authentication** – Handles access tokens and refresh tokens.  
✔ **Full API Coverage** – Supports attributes, averages, correlations, insights, and user profiles.  
✔ **Strongly Typed Models** – Uses TypeScript interfaces and enums to ensure type safety.  

## **Installation**
To install the package for a **Node.js** project using npm, run:
```sh
npm install exist-sdk-typescript
```

To install in a **Deno** project,run:
```sh
deno add jsr:@leonschreiber96/exist-sdk-typescript
```

## **Getting Started**

### **0️⃣ Import the SDK**
Using NPM:
```typescript
import { ExistAuthorizer, ExistClient } from "exist-sdk-typescript";
```

Using Deno:
```typescript
import { ExistClient, ExistAuthorizer } from "@leonschreiber96/exist-sdk-typescript";
```

### **1️⃣ Authentication**
To interact with the Exist.io API, you must authenticate using OAuth2. Follow [this guide](https://exist.io/blog/how-to-get-api-token/) to create an API client.

Use the `ExistAuthorizer` class to provide authentication tokens in one of three ways:

```typescript
const authorizer = new ExistAuthorizer("your-client-id", "your-client-secret");

// Option 1: Provide tokens directly
authorizer.useTokens("your-access-token", "your-refresh-token");

// Option 2: Load tokens from a JSON file
authorizer.useAuthorizationFile("path/to/tokens.json");

// Option 3: Use OAuth2 flow to obtain a token dynamically
authorizer.useOAuthFlow(["mood_read", "activity_read"], "http://localhost:8000");
```

#### **Authentication JSON File**
If you're using **Option 2** (loading tokens from a JSON file), the JSON file should be in the standard OAuth2 response format:

```json
{
  "access_token": "your-access-token",
  "refresh_token": "your-refresh-token",
  "token_type": "Bearer",
  "expires_in": 36000,
  "scope": "activity_read+mood_read"
}
```

You can generate this file automatically by calling `authorizer.dumpAuthorizationToFile("tokens.json")` after completing the OAuth2 flow.

#### **OAuth2 Flow**
For **Option 3**, the `useOAuthFlow` method requires two arguments:

1. **Scopes**: A list of scopes that define the level of access your client has. Scopes can be read or write permissions (for example, `ReadScope.MOOD`, `WriteScope.ACTIVITY`, etc.). The first argument to `useOAuthFlow` should be an array of the scopes your client will need. You can choose to give your client read, write, or both types of permissions, depending on your use case.

2. **Redirect URI**: This must be a free port on localhost (e.g., `http://localhost:8000/`) and **must match the redirect uri you entered when creating your developer client**. Your client will listen for the OAuth response from Exist on this port and automatically extract the access and refresh tokens. After completing the OAuth flow, be sure to **save the tokens** that the client displays.

3. **Callback** (*optional*): Function that will be executed after the oAuth flow has been completed. Gets the oAuth token response passed as a parameter. You can use this for example to save your tokens to a file, using `authorizer.dumpAuthorizationToFile("filename.json")`

Here is an example:
```typescript
authorizer.useOAuthFlow(
  [ReadScope.FINANCE, WriteScope.FINANCE], // Scopes
  "http://localhost:8000/", // Redirect URI
  (tokens) => { console.log(tokens) } // Callback function
);
```

### **2️⃣ Initialize the ExistClient**
Once authenticated, initialize `ExistClient` to make API calls:
```typescript
const client = new ExistClient(authorizer);
```

### **3️⃣ Fetch Data from Exist.io**
#### **📌 Get User Profile**
```typescript
const profile = await client.users.getUserProfile();
console.log(profile);
```

#### **📌 Get Owned Attributes**
```typescript
const attributes = await client.attributes.getOwned();
console.log(attributes);
```

#### **📌 Update an Attribute**
```typescript
await client.attributes.updateValues([{ name: "steps", value: 5000, date: "2025-03-05" }]);
```

#### **📌 Handle API Errors**
All API errors throw an `ExistApiError` with a `statusCode` and the API's error body:
```typescript
import { ExistApiError } from "exist-sdk-typescript";

try {
  await client.attributes.updateValues([{ name: "steps", value: 5000, date: "2025-03-05" }]);
} catch (error) {
  if (error instanceof ExistApiError) {
    console.error(`HTTP ${error.statusCode}: ${error.message}`);
    console.error(error.body); // full API error response
  }
}
```

## **API Reference**
The SDK provides structured access to the Exist.io API through these modules:

| Module | Description |
|--------|-------------|
| `attributes` | Manage tracked attributes (e.g., mood, steps, sleep). |
| `averages` | Get attribute averages over time. |
| `users` | Access user profile data. |
| `correlations` | Find correlations between tracked attributes. |
| `insights` | Retrieve generated insights. |

## **Contributing**
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch (`feature/my-feature`).
3. Commit your changes.
4. Push to the branch.
5. Open a Pull Request.

## **License**
This project is licensed under the **GNU GPL-3.0 license**.
