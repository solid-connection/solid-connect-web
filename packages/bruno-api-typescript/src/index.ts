/**
 * bruno-openapi-sync
 * Main entry point for programmatic usage
 */

export { parseBrunoFile, extractJsonFromDocs } from './parser/bruParser';
export type { ParsedBrunoFile, BrunoRequest } from './parser/bruParser';

export { inferSchema } from './converter/schemaBuilder';
export type { OpenAPISchema } from './converter/schemaBuilder';

export { convertBrunoToOpenAPI } from './converter/openapiConverter';
export type { OpenAPISpec, ConversionOptions } from './converter/openapiConverter';

export { detectChanges, groupChangesByDomain, isBreakingChange } from './diff/changeDetector';
export type {
  ChangeReport,
  EndpointChange,
  FieldChange,
  ChangeType,
  ChangeSeverity,
} from './diff/changeDetector';

export { generateChangelog, formatConsoleOutput } from './diff/changelogGenerator';
export type { ChangelogOptions, ChangelogFormat } from './diff/changelogGenerator';
