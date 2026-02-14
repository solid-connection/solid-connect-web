# API Definitions Specification

## Overview

This document describes how Bruno files are transformed into typed API definitions and factory functions for type-safe API consumption in TypeScript applications.

## Architecture

### 1. Generated File Structure

For each domain (based on Bruno folder structure), the following files are generated:

```
src/apis/
├── users/
│   ├── api.ts                    # API factory with all endpoints
│   ├── apiDefinitions.ts         # Type metadata for each endpoint
│   └── index.ts                  # Exports
├── products/
│   ├── api.ts
│   ├── apiDefinitions.ts
│   └── index.ts
```

### 2. API Factory (api.ts)

**Purpose**: Provides typed API client functions grouped by domain.

**Example**:
```typescript
export const usersApi = {
  getProfile: async (params: { params?: Record<string, unknown> }): Promise<GetProfileResponse> => {
    const res = await axiosInstance.get<GetProfileResponse>(`/users/profile`, { params: params?.params });
    return res.data;
  },
  
  updateProfile: async (params: { data: UpdateProfileRequest }): Promise<UpdateProfileResponse> => {
    const res = await axiosInstance.put<UpdateProfileResponse>(`/users/profile`, params.data);
    return res.data;
  },
};
```

**Type Safety Features**:
- Full TypeScript type inference
- Compile-time parameter validation
- Response type checking

### 3. API Definitions (apiDefinitions.ts)

**Purpose**: Provides typed metadata about each API endpoint.

**Example**:
```typescript
import type { GetProfileResponse, UpdateProfileRequest, UpdateProfileResponse } from './api';

export const usersApiDefinitions = {
  getProfile: {
    method: 'GET' as const,
    path: '/users/profile' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, unknown>,
    body: {} as Record<string, never>,
    response: {} as GetProfileResponse,
  },
  
  updateProfile: {
    method: 'PUT' as const,
    path: '/users/profile' as const,
    pathParams: {} as Record<string, never>,
    queryParams: {} as Record<string, never>,
    body: {} as UpdateProfileRequest,
    response: {} as UpdateProfileResponse,
  },
} as const;

export type UsersApiDefinitions = typeof usersApiDefinitions;
```

**Metadata Fields**:

| Field | Type | Description |
|-------|------|-------------|
| `method` | `'GET' \| 'POST' \| 'PUT' \| 'PATCH' \| 'DELETE'` | HTTP method |
| `path` | `string` | URL path template |
| `pathParams` | Type object | Path parameter types |
| `queryParams` | Type object | Query parameter types |
| `body` | Type object | Request body type |
| `response` | Type object | Response type |

## Type Generation Rules

### 1. Path Parameters

**Bruno File**: `GET /users/:userId/posts/:postId`

**Generated Type**:
```typescript
pathParams: {} as { userId: string | number; postId: string | number }
```

### 2. Query Parameters

**For GET requests**:
```typescript
queryParams: {} as Record<string, unknown>
```

**For non-GET requests**:
```typescript
queryParams: {} as Record<string, never>
```

### 3. Request Body

**For POST/PUT/PATCH with body**:
```typescript
body: {} as CreateUserRequest
```

**For GET/DELETE or no body**:
```typescript
body: {} as Record<string, never>
```

### 4. Response Types

**Generated from Bruno docs block**:
```typescript
response: {} as GetUserResponse
```

**If no docs block**:
```typescript
response: {} as void
```

## Usage Examples

### Direct API Calls

```typescript
import { usersApi } from '@/apis/users';

// GET request
const profile = await usersApi.getProfile({ 
  params: { includeDetails: true } 
});

// POST request
const newUser = await usersApi.createUser({ 
  data: { name: 'John', email: 'john@example.com' } 
});

// PUT request with path params
const updated = await usersApi.updatePost({ 
  postId: 123, 
  data: { title: 'New Title' } 
});
```

### With Custom Hooks

```typescript
import { usersApi } from '@/apis/users';

export async function fetchProfile() {
  return usersApi.getProfile({});
}
```

### Using Type Metadata

```typescript
import { usersApiDefinitions } from '@/apis/users';

// Extract types
type ProfileResponse = typeof usersApiDefinitions.getProfile.response;
type UpdateRequest = typeof usersApiDefinitions.updateProfile.body;

// Runtime metadata
console.log(usersApiDefinitions.getProfile.method);   // 'GET'
console.log(usersApiDefinitions.getProfile.path);     // '/users/profile'
```

## File Generation Process

1. **Parse Bruno Files**: Extract API definitions from `.bru` files
2. **Extract Metadata**: Determine method, path, parameters, body, response
3. **Infer Types**: Generate TypeScript types from docs JSON examples
4. **Generate Factory**: Create typed API client functions
5. **Generate Definitions**: Create type metadata exports
6. **Generate Index**: Export all APIs from domain

## Type Safety Guarantees

### Compile-Time Validation

```typescript
// ✅ Correct usage
await usersApi.getProfile({ params: { page: 1 } });

// ❌ Type error: missing data parameter
await usersApi.createUser({});

// ❌ Type error: wrong parameter type
await usersApi.getProfile({ data: {} });
```

### Response Type Inference

```typescript
const profile = await usersApi.getProfile({});
// profile is automatically typed as GetProfileResponse

profile.id;        // ✅ OK
profile.username;  // ✅ OK
profile.invalid;   // ❌ Type error
```

## Best Practices

### 1. Do Not Modify Generated Files

Generated files (`api.ts`, `apiDefinitions.ts`) are overwritten on each generation. Do not add custom logic to these files.

### 2. Keep Custom Logic Separate

```
src/
├── apis/          # Generated (do not modify)
│   └── users/
│       ├── api.ts
│       └── apiDefinitions.ts
└── hooks/         # Custom hooks (safe to modify)
    └── useAuth.ts
```

### 3. Use Type Metadata for Generic Functions

```typescript
import { usersApiDefinitions } from '@/apis/users';

function getEndpointPath<T extends keyof typeof usersApiDefinitions>(
  endpoint: T
) {
  return usersApiDefinitions[endpoint].path;
}
```

## Migration from Query Keys

Previous version generated hooks and query keys. The new approach:

**Before**:
```typescript
import { useGetProfile } from '@/apis/users';
const { data } = useGetProfile();
```

**After**:
```typescript
import { usersApi } from '@/apis/users';
const data = await usersApi.getProfile({});
```

**Benefits**:
- Framework-agnostic API clients
- Easier testing (mock API functions directly)
- Clear separation between data fetching and business logic

## Related Files

- `src/generator/apiFactoryGenerator.ts` - Generates API factory
- `src/generator/apiDefinitionGenerator.ts` - Generates type definitions
- `src/generator/typeGenerator.ts` - Infers TypeScript types
- `src/parser/bruParser.ts` - Parses Bruno files
