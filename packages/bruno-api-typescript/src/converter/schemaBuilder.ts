/**
 * JSON 샘플로부터 OpenAPI 스키마 생성
 */

export interface OpenAPISchema {
  type: string;
  properties?: Record<string, OpenAPISchema>;
  items?: OpenAPISchema;
  description?: string;
  required?: string[];
  nullable?: boolean;
  enum?: any[];
  example?: any;
}

/**
 * JSON 값으로부터 OpenAPI 스키마 생성
 */
export function inferSchema(value: any): OpenAPISchema {
  if (value === null) {
    return { type: 'null', nullable: true };
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return {
        type: 'array',
        items: { type: 'object' },
      };
    }
    return {
      type: 'array',
      items: inferSchema(value[0]),
    };
  }

  const valueType = typeof value;

  switch (valueType) {
    case 'string':
      return { type: 'string', example: value };
    case 'number':
      return {
        type: Number.isInteger(value) ? 'integer' : 'number',
        example: value,
      };
    case 'boolean':
      return { type: 'boolean', example: value };
    case 'object':
      return inferObjectSchema(value);
    default:
      return { type: 'string' };
  }
}

/**
 * 객체로부터 스키마 생성
 */
function inferObjectSchema(obj: Record<string, any>): OpenAPISchema {
  const properties: Record<string, OpenAPISchema> = {};
  const required: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    properties[key] = inferSchema(value);
    if (value !== null && value !== undefined) {
      required.push(key);
    }
  }

  return {
    type: 'object',
    properties,
    required: required.length > 0 ? required : undefined,
  };
}
