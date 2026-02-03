/**
 * TypeScript 타입 생성기
 * Bruno docs 블록의 JSON에서 TypeScript 타입 생성
 */

export interface TypeDefinition {
  name: string;
  content: string;
}

/**
 * JSON 값으로부터 TypeScript 타입 추론
 */
export function inferTypeScriptType(value: any, typeName: string = 'Unknown', indent: number = 0): string {
  if (value === null || value === undefined) {
    return 'null';
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return 'any[]';
    }
    const itemType = inferTypeScriptType(value[0], `${typeName}Item`, indent);
    // 배열 아이템이 객체면 별도 인터페이스로 추출
    if (typeof value[0] === 'object' && !Array.isArray(value[0])) {
      return `${typeName}Item[]`;
    }
    return `${itemType}[]`;
  }

  const valueType = typeof value;

  switch (valueType) {
    case 'string':
      return 'string';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'object':
      return generateInterfaceContent(value, indent);
    default:
      return 'any';
  }
}

/**
 * 객체로부터 인터페이스 내용 생성
 */
function generateInterfaceContent(obj: Record<string, any>, indent: number = 0): string {
  const indentStr = '  '.repeat(indent);
  const properties: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const type = inferTypeScriptType(value, toPascalCase(key), indent + 1);
    properties.push(`${indentStr}  ${key}: ${type};`);
  }

  return `{\n${properties.join('\n')}\n${indentStr}}`;
}

/**
 * JSON 객체로부터 TypeScript 인터페이스 생성
 */
export function generateTypeScriptInterface(
  json: any,
  interfaceName: string
): TypeDefinition[] {
  const definitions: TypeDefinition[] = [];

  // 중첩된 타입 추출 (메인 타입 제외)
  extractNestedTypes(json, '', definitions, interfaceName, true);

  // 메인 인터페이스 생성
  const properties: string[] = [];
  for (const [key, value] of Object.entries(json)) {
    let type = getPropertyType(value, toPascalCase(key), interfaceName);
    
    // 배열인 경우 유니온 타입 확인
    if (Array.isArray(value) && value.length > 0) {
      const types = new Set<string>();
      for (const item of value) {
        if (item === null || item === undefined) {
          types.add('null');
        } else {
          const itemType = getPropertyType(item, toPascalCase(key), `${interfaceName}${toPascalCase(key)}Item`);
          types.add(itemType);
        }
      }
      const typeArray = Array.from(types);
      if (typeArray.length > 1) {
        type = `(${typeArray.join(' | ')})[]`;
      }
    } else if (value === null || value === undefined) {
      // 단일 null 값은 그대로 유지 (유니온 타입 생성 불가)
      type = 'null';
    }
    
    properties.push(`  ${key}: ${type};`);
  }

  // 빈 인터페이스인 경우 Record<string, never> 타입으로 생성
  if (properties.length === 0) {
    const emptyType = `export type ${interfaceName} = Record<string, never>;`;
    definitions.push({ name: interfaceName, content: emptyType });
  } else {
    const mainInterface = `export interface ${interfaceName} {\n${properties.join('\n')}\n}`;
    definitions.push({ name: interfaceName, content: mainInterface });
  }

  return definitions;
}

/**
 * 중첩된 타입 추출
 */
function extractNestedTypes(
  value: any,
  typeName: string,
  definitions: TypeDefinition[],
  parentTypeName?: string,
  isRoot: boolean = false
): void {
  if (Array.isArray(value) && value.length > 0) {
    const itemType = value[0];
    if (typeof itemType === 'object' && !Array.isArray(itemType) && itemType !== null) {
      // 부모 타입 이름을 포함하여 고유한 타입 이름 생성
      const itemTypeName = parentTypeName 
        ? `${parentTypeName}${typeName}Item`
        : `${typeName}Item`;
      const properties: string[] = [];

      // 배열의 모든 아이템을 확인하여 각 필드의 타입 수집
      const fieldTypes = new Map<string, Set<string>>();
      
      // 모든 아이템을 순회하며 각 필드의 타입 수집
      for (const item of value) {
        if (typeof item === 'object' && !Array.isArray(item) && item !== null) {
          for (const [key, val] of Object.entries(item)) {
            if (!fieldTypes.has(key)) {
              fieldTypes.set(key, new Set());
            }
            const typeSet = fieldTypes.get(key)!;
            
            if (val === null || val === undefined) {
              typeSet.add('null');
            } else {
              // 중첩된 객체인 경우 부모 타입 이름 포함 (중복 방지)
              const propTypeName = typeof val === 'object' && !Array.isArray(val) && val !== null
                ? `${itemTypeName}${toPascalCase(key)}`
                : toPascalCase(key);
              const propType = getPropertyType(val, toPascalCase(key), itemTypeName);
              typeSet.add(propType);
            }
          }
        }
      }

      // 유니온 타입 생성 및 중첩 타입 추출
      for (const [key, typeSet] of fieldTypes) {
        const types = Array.from(typeSet);
        const propType = types.length === 1 
          ? types[0] 
          : types.join(' | ');
        properties.push(`  ${key}: ${propType};`);

        // 재귀적으로 중첩된 타입 추출
        const val = itemType[key];
        if (val !== null && val !== undefined) {
          const nestedTypeName = `${itemTypeName}${toPascalCase(key)}`;
          extractNestedTypes(val, toPascalCase(key), definitions, itemTypeName);
        }
      }

      const interfaceContent = `export interface ${itemTypeName} {\n${properties.join('\n')}\n}`;
      definitions.unshift({ name: itemTypeName, content: interfaceContent });
    }
  } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    // 루트 레벨이 아니고 부모 타입 이름이 있는 경우에만 타입 정의 생성
    if (!isRoot && parentTypeName && typeName) {
      const nestedTypeName = `${parentTypeName}${typeName}`;
      const properties: string[] = [];
      const fieldTypes = new Map<string, Set<string>>();
      
      // 모든 필드의 타입 수집
      for (const [key, val] of Object.entries(value)) {
        if (!fieldTypes.has(key)) {
          fieldTypes.set(key, new Set());
        }
        const typeSet = fieldTypes.get(key)!;
        
        if (val === null || val === undefined) {
          typeSet.add('null');
        } else {
          const propType = getPropertyType(val, toPascalCase(key), nestedTypeName);
          typeSet.add(propType);
        }
      }
      
      // 유니온 타입 생성
      for (const [key, typeSet] of fieldTypes) {
        const types = Array.from(typeSet);
        const propType = types.length === 1 
          ? types[0] 
          : types.join(' | ');
        properties.push(`  ${key}: ${propType};`);
        
        // 재귀적으로 중첩된 타입 추출
        const val = value[key];
        if (val !== null && val !== undefined) {
          extractNestedTypes(val, toPascalCase(key), definitions, nestedTypeName, false);
        }
      }
      
      // 타입 정의 추가
      if (properties.length > 0) {
        const interfaceContent = `export interface ${nestedTypeName} {\n${properties.join('\n')}\n}`;
        definitions.unshift({ name: nestedTypeName, content: interfaceContent });
      }
    } else {
      // 루트 레벨이거나 타입 이름이 없는 경우, 자식만 재귀적으로 추출
      for (const [key, val] of Object.entries(value)) {
        const childParentTypeName = isRoot ? parentTypeName : (parentTypeName ? `${parentTypeName}${typeName}` : typeName);
        extractNestedTypes(val, toPascalCase(key), definitions, childParentTypeName, false);
      }
    }
  }
}

/**
 * 프로퍼티 타입 결정
 */
function getPropertyType(value: any, typeName: string, parentTypeName?: string): string {
  if (value === null || value === undefined) {
    return 'null';
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return 'any[]';
    }
    const itemType = value[0];
    if (typeof itemType === 'object' && !Array.isArray(itemType) && itemType !== null) {
      // 부모 타입 이름을 포함하여 고유한 타입 이름 생성
      const itemTypeName = parentTypeName 
        ? `${parentTypeName}${typeName}Item`
        : `${typeName}Item`;
      return `${itemTypeName}[]`;
    }
    // 배열의 모든 아이템을 확인하여 유니온 타입 생성
    const types = new Set<string>();
    for (const item of value) {
      if (item === null || item === undefined) {
        types.add('null');
      } else {
        types.add(getPropertyType(item, typeName, parentTypeName));
      }
    }
    const typeArray = Array.from(types);
    if (typeArray.length === 1) {
      return `${typeArray[0]}[]`;
    }
    return `(${typeArray.join(' | ')})[]`;
  }

  const valueType = typeof value;

  switch (valueType) {
    case 'string':
      return 'string';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'object':
      // 부모 타입 이름을 포함하여 고유한 타입 이름 생성 (중복 방지)
      if (parentTypeName) {
        // 이미 부모 타입 이름이 포함되어 있는지 확인
        if (typeName.startsWith(parentTypeName)) {
          return typeName;
        }
        return `${parentTypeName}${typeName}`;
      }
      return typeName;
    default:
      return 'any';
  }
}

/**
 * 문자열을 PascalCase로 변환
 */
function toPascalCase(str: string): string {
  return str
    .replace(/[-_](.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (_, c) => c.toUpperCase());
}

/**
 * 문자열을 camelCase로 변환
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/[-_](.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (_, c) => c.toLowerCase());
}

/**
 * URL 경로를 함수명으로 변환
 * 예: /applications/competitors -> getApplicationsCompetitors
 */
export function urlToFunctionName(method: string, url: string): string {
  // 경로 파라미터 제거 및 처리
  const pathParts = url
    .split('/')
    .filter(part => part.length > 0)
    .map(part => {
      // :id, {id} 같은 파라미터 처리
      if (part.startsWith(':') || part.startsWith('{')) {
        return 'ById';
      }
      return toPascalCase(part);
    });

  const baseName = pathParts.join('');
  const methodPrefix = method.toLowerCase();

  return `${methodPrefix}${baseName}`;
}

/**
 * 함수명을 타입명으로 변환
 * 예: getApplicationsCompetitors -> GetApplicationsCompetitorsResponse
 */
export function functionNameToTypeName(functionName: string, suffix: string = 'Response'): string {
  return `${toPascalCase(functionName)}${suffix}`;
}
