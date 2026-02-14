# Project: bruno-api-typescript

## Overview

The `bruno-api-typescript` project is an automation tool designed to streamline API synchronization between backend development (using Bruno `.bru` files) and frontend development. It automatically transforms Bruno request definitions into OpenAPI specifications and typed API clients (along with optional Mock Service Worker (MSW) handlers). This entire process is integrated with GitHub Apps and GitHub Actions, enabling automated generation of client code and Pull Requests in frontend repositories whenever backend API definitions in Bruno files change.

**Core Goal:** To minimize manual effort in maintaining API client code and documentation by automating the generation process directly from Bruno API definitions.

## Key Functionalities

1.  **OpenAPI Specification Generation:** Converts Bruno `.bru` collection files into a comprehensive OpenAPI 3.0.0 specification (`openapi.json`). This includes API paths, methods, request bodies, and inferred response schemas based on JSON examples provided in the Bruno `docs` blocks.
2.  **Typed API Client Generation:** Generates TypeScript API factory functions from Bruno API definitions. These clients are type-safe, leveraging inferred schemas for request and response types.
3.  **API Definitions Generation:** Creates typed metadata files (`apiDefinitions.ts`) that provide type information for each API endpoint including method, path, parameters, body, and response types.
4.  **Mock Service Worker (MSW) Handlers Generation (Optional):** Can generate MSW handlers to mock API responses during frontend development and testing, based on the same Bruno definitions.
5.  **Change Detection and Changelog Generation:** Detects breaking changes between different versions of the OpenAPI specification and can generate detailed changelogs (Markdown, JSON, HTML) to inform frontend teams about API modifications.
6.  **GitHub Apps Integration:** Designed to run within GitHub Actions workflows, leveraging GitHub Apps for programmatic access to repositories (reading Bruno files, creating PRs in frontend repos).
7.  **Incremental Generation:** Utilizes a hash-based caching mechanism (`BrunoHashCache`) to intelligently regenerate only the changed API clients, optimizing performance for large projects.

## Architecture and Module Interaction

The project follows a CLI-driven, pipeline-like architecture with a clear separation of concerns.

### Main Components and Their Responsibilities:

*   **CLI (`src/cli/index.ts`)**:
    *   **Role:** The primary entry point for the tool. It parses command-line arguments (`generate` for OpenAPI, `generate-hooks` for API clients/MSW).
    *   **Interaction:** Orchestrates the entire process by invoking the appropriate internal modules based on the command and options provided.
*   **Parser (`src/parser/bruParser.ts`)**:
    *   **Role:** Responsible for reading and parsing individual Bruno `.bru` files. It extracts structured data such as request metadata (`meta`), HTTP details (method, URL), headers, request body, and the crucial `docs` block content.
    *   **Interaction:** Provides the raw, structured representation of Bruno API definitions to the Converter and Generator modules.
*   **Converter (`src/converter/openapiConverter.ts`, `src/converter/schemaBuilder.ts`)**:
    *   **`openapiConverter.ts` Role:** Takes the parsed Bruno data and constructs the OpenAPI Specification. It iterates through Bruno files, extracts domains for tagging, normalizes URLs, and builds operation objects for each API endpoint.
    *   **`schemaBuilder.ts` Role:** Infers JSON schemas (used in OpenAPI for request/response bodies) from example JSON data extracted from the Bruno `docs` blocks. It handles primitive types, arrays, and objects, marking properties as `required` if present in the example.
    *   **Interaction:** `bruParser` feeds data to `openapiConverter`, which in turn uses `schemaBuilder` to infer schemas for the OpenAPI spec.
*   **Generator (`src/generator/index.ts`, `src/generator/*Generator.ts`)**:
    *   **`index.ts` Role:** The main orchestrator for generating frontend-specific code. It manages the `BrunoHashCache` for incremental updates, collects Bruno files, and then dispatches to specialized generators.
    *   **`apiClientGenerator.ts` (implied from `extractApiFunction`) Role:** Extracts API function metadata from parsed Bruno files.
    *   **`apiFactoryGenerator.ts` Role:** Generates API factory files, grouping related API functions by domain with full type safety.
    *   **`apiDefinitionGenerator.ts` Role:** Generates typed API metadata files with method, path, parameter, body, and response type information.
    *   **`mswGenerator.ts` Role:** Generates Mock Service Worker (MSW) request handlers from Bruno API definitions and `docs` examples.
    *   **`typeGenerator.ts` Role:** Infers TypeScript types from JSON examples in Bruno `docs` blocks.
    *   **Interaction:** `bruParser` feeds data to `index.ts`, which then uses various `*Generator.ts` modules to produce the final client-side code. `BrunoHashCache` is used throughout to manage regeneration efficiently.
*   **Diffing (`src/diff/changeDetector.ts`, `src/diff/changelogGenerator.ts`)**:
    *   **`changeDetector.ts` Role:** Compares two OpenAPI specifications to identify differences, categorizing them (e.g., breaking changes, non-breaking changes).
    *   **`changelogGenerator.ts` Role:** Formats the detected changes into a human-readable changelog.
    *   **Interaction:** Used by the CLI `generate` command when the `--diff` option is enabled, operating on generated OpenAPI specs.

## API Structure and Conventions

This project does not define its own external API endpoints. Instead, it processes API definitions provided in Bruno `.bru` files.

*   **Bruno `.bru` Files:** Serve as the source of truth for API definitions. Each `.bru` file typically represents a single API request and includes:
    *   `meta` block: Defines request name, type, etc.
    *   HTTP method and URL (e.g., `get /users/profile`).
    *   `headers` block: HTTP headers.
    *   `body:json` block: JSON request body content.
    *   `docs` block: Crucially, this block can contain Markdown, including ````json` code blocks that provide example JSON responses. These examples are used for schema inference.
*   **Generated OpenAPI Spec:** Conforms to the OpenAPI 3.0.0 standard, providing a machine-readable API contract. Paths are normalized (e.g., `/users/:id` becomes `/users/{id}`).
*   **Generated API Clients:** Domain-based API factories and typed API definitions for each endpoint.
*   **Generated MSW Handlers:** Designed to integrate seamlessly with the Mock Service Worker library.

## Data Flow

1.  **Input:** Bruno `.bru` files (containing API request definitions and JSON examples in `docs` blocks).
2.  **Parsing:** `bruParser` reads `.bru` files into structured `ParsedBrunoFile` objects.
3.  **Schema Inference:** `schemaBuilder` infers JSON schemas from `docs` JSON examples within the parsed Bruno files.
4.  **OpenAPI Generation:** `openapiConverter` uses parsed Bruno data and inferred schemas to build `OpenAPISpec`.
5.  **Client Code Generation:** `generator/index.ts` uses parsed Bruno data and inferred schemas (implicitly via other generator modules) to produce:
    *   API factory functions (`apiFactoryGenerator`)
    *   API definitions (`apiDefinitionGenerator`)
    *   MSW handlers (`mswGenerator`)
6.  **Output:** `openapi.json`, TypeScript files for API factories, API definitions, and MSW handlers.
7.  **Automation Flow (via GitHub Actions):**
    *   Backend developer pushes changes to Bruno files.
    *   GitHub Action triggers `bruno-api-typescript` CLI.
    *   The tool generates updated OpenAPI spec and frontend client code.
    *   A Pull Request is automatically created against the frontend repository with the generated code.

## Technologies Used

*   **TypeScript:** Primary development language.
*   **Node.js:** Runtime environment.
*   **Commander.js:** CLI framework.
*   **Bruno:** API client for defining requests.
*   **OpenAPI (Swagger):** Standard for API documentation and client generation.
*   **Mock Service Worker (MSW):** API mocking library.
*   **Mock Service Worker (MSW):** API mocking library.
*   **GitHub Apps / GitHub Actions:** For automation and integration with repositories.
*   **YAML:** For parsing Bruno files.

## Development Environment Setup

1.  Clone the repository.
2.  Install dependencies: `npm install`.
3.  Build the project: `npm run build`.
4.  Refer to `README.md` for detailed GitHub App and workflow configuration.
