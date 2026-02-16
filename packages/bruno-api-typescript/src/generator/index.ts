/**
 * API 생성 메인 로직
 * Bruno 파일들을 읽어서 API 팩토리 및 타입 정의를 생성
 */

import { existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "fs";
import { dirname, join, relative } from "path";
import { type ParsedBrunoFile, parseBrunoFile } from "../parser/bruParser";
import { type ApiFunction, extractApiFunction } from "./apiClientGenerator";
import { generateApiDefinitionsFile } from "./apiDefinitionGenerator";
import { generateApiFactory } from "./apiFactoryGenerator";
import { BrunoHashCache } from "./brunoHashCache";
import { generateDomainHandlersIndex, generateMSWHandler, generateMSWIndex } from "./mswGenerator";
import { functionNameToTypeName, toCamelCase } from "./typeGenerator";

export interface GenerateHooksOptions {
  brunoDir: string;
  outputDir: string;
  axiosInstancePath?: string;
  mswOutputDir?: string;
  force?: boolean;
  rootIndexPath?: string;
  cleanOutput?: boolean;
}

type ParsedDomainFile = {
  filePath: string;
  parsed: ParsedBrunoFile;
  domain: string;
};

/**
 * Bruno 디렉토리에서 모든 .bru 파일 찾기
 */
function findBrunoFiles(dir: string): string[] {
  const files: string[] = [];

  function traverse(currentDir: string) {
    const entries = readdirSync(currentDir);

    for (const entry of entries) {
      const fullPath = join(currentDir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (entry.endsWith(".bru") && entry !== "collection.bru") {
        // collection.bru는 메타데이터 파일이므로 제외
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files.sort();
}

/**
 * 파일 경로에서 도메인 추출
 * - "Solid Connection" 최상단 폴더를 제거하고 대괄호 패턴이 있는 첫 번째 폴더를 도메인으로 인식
 * - "숫자) 한글명 [영문키]" 형식: 1) 어드민 [Admin] → Admin
 * - "한글명 [영문키]" 형식: 사용자 [users] → users
 */
function extractDomain(filePath: string, brunoDir: string): string {
  const relativePath = relative(brunoDir, filePath);
  const parts = relativePath.split("/");

  // "Solid Connection" 폴더 제거
  const filteredParts = parts.filter((part) => part !== "Solid Connection");

  // 대괄호 패턴이 있는 첫 번째 폴더 찾기
  const bracketPattern = /\[([^\]]+)\]/;
  for (const part of filteredParts) {
    const bracketMatch = part.match(bracketPattern);
    if (bracketMatch) {
      return bracketMatch[1].trim(); // 대괄호 안의 영문키
    }
  }

  // 패턴이 없으면 파일이 있는 폴더명 사용 (마지막에서 두 번째)
  return filteredParts[filteredParts.length - 2] || filteredParts[0] || "default";
}

function listGeneratedDomainDirs(outputDir: string): string[] {
  if (!existsSync(outputDir)) {
    return [];
  }

  return readdirSync(outputDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== ".bruno-cache")
    .map((entry) => entry.name);
}

function cleanStaleDomains(outputDir: string, activeDomains: Set<string>): void {
  const existingDomains = listGeneratedDomainDirs(outputDir);

  for (const domain of existingDomains) {
    if (activeDomains.has(domain)) {
      continue;
    }

    const staleDomainDir = join(outputDir, domain);
    rmSync(staleDomainDir, { recursive: true, force: true });
    console.log(`🗑️  Removed stale domain output: ${staleDomainDir}`);
  }
}

function ensureUniqueApiFunctionNames(entries: Array<{ apiFunc: ApiFunction; parsed: ParsedBrunoFile }>): void {
  const nameCount = new Map<string, number>();

  for (const entry of entries) {
    const baseName = entry.apiFunc.name;
    const currentCount = nameCount.get(baseName) ?? 0;

    if (currentCount === 0) {
      nameCount.set(baseName, 1);
      entry.apiFunc.responseType = functionNameToTypeName(entry.apiFunc.name);
      continue;
    }

    const nextCount = currentCount + 1;
    nameCount.set(baseName, nextCount);
    entry.apiFunc.name = `${baseName}${nextCount}`;
    entry.apiFunc.responseType = functionNameToTypeName(entry.apiFunc.name);
  }
}

/**
 * API 팩토리 및 타입 정의 생성
 */
export async function generateHooks(options: GenerateHooksOptions): Promise<void> {
  const {
    brunoDir,
    outputDir,
    axiosInstancePath = "@/utils/axiosInstance",
    mswOutputDir,
    force = false,
    rootIndexPath = join(outputDir, "index.ts"),
    cleanOutput = false,
  } = options;

  const hashCache = new BrunoHashCache(outputDir);
  hashCache.load();

  console.log("🔍 Searching for .bru files...");
  const brunoFiles = findBrunoFiles(brunoDir);
  console.log(`✅ Found ${brunoFiles.length} .bru files`);

  if (brunoFiles.length === 0) {
    console.log("⚠️  No .bru files found");
    return;
  }

  // 변경된 파일 필터링
  let changedFiles: string[] = [];
  const skippedFiles: string[] = [];

  if (force) {
    console.log("🔨 Force mode: regenerating all hooks");
    changedFiles = brunoFiles;
  } else {
    for (const filePath of brunoFiles) {
      if (hashCache.hasChanged(filePath)) {
        changedFiles.push(filePath);
      } else {
        skippedFiles.push(filePath);
      }
    }
  }

  console.log(`📊 Changed: ${changedFiles.length}, Skipped: ${skippedFiles.length}`);

  if (changedFiles.length === 0) {
    console.log("✅ All API clients are up to date!");
  }

  const parseFileWithDomain = (filePath: string): ParsedDomainFile | null => {
    try {
      const parsed = parseBrunoFile(filePath);
      const domain = extractDomain(filePath, brunoDir);
      return { filePath, parsed, domain };
    } catch (error) {
      return null;
    }
  };

  const parsedChangedFiles = changedFiles
    .map((filePath) => {
      const parsed = parseFileWithDomain(filePath);
      if (!parsed) {
        console.error(`❌ Error parsing ${filePath}`);
      }
      return parsed;
    })
    .filter((value): value is ParsedDomainFile => value !== null);

  const allParsedFiles = brunoFiles
    .map(parseFileWithDomain)
    .filter((value): value is ParsedDomainFile => value !== null);

  console.log(`📝 Parsed ${parsedChangedFiles.length} changed files successfully`);

  mkdirSync(outputDir, { recursive: true });

  const affectedDomains = new Set(parsedChangedFiles.map((f) => f.domain));
  const allDomains = new Set<string>();

  const domainApiFunctions = new Map<string, Array<{ apiFunc: ApiFunction; parsed: ParsedBrunoFile }>>();
  const domainDirs = new Set<string>();

  for (const { filePath, parsed, domain } of allParsedFiles) {
    const apiFunc = extractApiFunction(parsed, filePath);
    if (!apiFunc) {
      continue;
    }

    allDomains.add(domain);

    const domainDir = join(outputDir, domain);
    if (!domainDirs.has(domainDir)) {
      mkdirSync(domainDir, { recursive: true });
      domainDirs.add(domainDir);
    }

    if (!domainApiFunctions.has(domain)) {
      domainApiFunctions.set(domain, []);
    }
    domainApiFunctions.get(domain)!.push({ apiFunc, parsed });
  }

  for (const [, entries] of domainApiFunctions) {
    ensureUniqueApiFunctionNames(entries);
  }

  if (cleanOutput) {
    cleanStaleDomains(outputDir, allDomains);
  }

  const sortedAllDomains = Array.from(allDomains).sort();
  const domainsToGenerate = force ? sortedAllDomains : sortedAllDomains.filter((domain) => affectedDomains.has(domain));

  console.log("\n🏭 Generating API factories...");
  for (const domain of domainsToGenerate) {
    const domainDir = join(outputDir, domain);
    mkdirSync(domainDir, { recursive: true });
    const apiFunctions = domainApiFunctions.get(domain) || [];
    const factoryContent = generateApiFactory(apiFunctions, domain, axiosInstancePath);
    const factoryPath = join(domainDir, "api.ts");
    writeFileSync(factoryPath, factoryContent, "utf-8");
    console.log(`✅ Generated: ${factoryPath}`);
  }

  console.log("\n📋 Generating API definitions...");
  for (const domain of domainsToGenerate) {
    const domainDir = join(outputDir, domain);
    const apiFunctions = domainApiFunctions.get(domain) || [];
    const definitionsContent = generateApiDefinitionsFile(apiFunctions, domain);
    const definitionsPath = join(domainDir, "apiDefinitions.ts");
    writeFileSync(definitionsPath, definitionsContent, "utf-8");
    console.log(`✅ Generated: ${definitionsPath}`);
  }

  for (const { filePath } of parsedChangedFiles) {
    const currentHash = hashCache.calculateHash(filePath);
    const apiFunc = extractApiFunction(parseBrunoFile(filePath), filePath);

    if (!apiFunc) {
      hashCache.setHash(filePath, currentHash, []);
      continue;
    }

    const domain = extractDomain(filePath, brunoDir);
    const domainDir = join(outputDir, domain);
    const outputFiles = [join(domainDir, "api.ts"), join(domainDir, "apiDefinitions.ts")];

    hashCache.setHash(filePath, currentHash, outputFiles);
  }

  console.log("\n📄 Generating index files...");
  for (const domain of sortedAllDomains) {
    const domainDir = join(outputDir, domain);
    const files = readdirSync(domainDir).filter((f) => f.endsWith(".ts") && f !== "index.ts");

    const indexContent =
      files
        .map((file) => {
          const name = file.replace(".ts", "");
          if (name === "api") {
            const factoryName = `${toCamelCase(domain)}Api`;
            return `export { ${factoryName} } from './api';`;
          }
          if (name === "apiDefinitions") {
            const camelDomain = toCamelCase(domain);
            const definitionsValueName = `${camelDomain}ApiDefinitions`;
            const definitionsTypeName = `${camelDomain.charAt(0).toUpperCase()}${camelDomain.slice(1)}ApiDefinitions`;
            return `export { ${definitionsValueName}, ${definitionsTypeName} } from './apiDefinitions';`;
          }
          return `export * from './${name}';`;
        })
        .join("\n") + "\n";

    const indexPath = join(domainDir, "index.ts");
    writeFileSync(indexPath, indexContent, "utf-8");
    console.log(`✅ Generated: ${indexPath}`);
  }

  const outputRelativeToRootIndexDir = relative(dirname(rootIndexPath), outputDir).replace(/\\/g, "/");
  const domainImportPrefix = outputRelativeToRootIndexDir
    ? outputRelativeToRootIndexDir.startsWith(".")
      ? outputRelativeToRootIndexDir
      : `./${outputRelativeToRootIndexDir}`
    : ".";

  const rootIndexContent =
    sortedAllDomains
      .map((domain) => {
        const importPath = domainImportPrefix === "." ? `./${domain}` : `${domainImportPrefix}/${domain}`;
        return `export * from '${importPath}';`;
      })
      .join("\n") + (sortedAllDomains.length > 0 ? "\n" : "");
  mkdirSync(dirname(rootIndexPath), { recursive: true });
  writeFileSync(rootIndexPath, rootIndexContent, "utf-8");
  console.log(`✅ Generated: ${rootIndexPath}`);

  hashCache.cleanup();
  hashCache.save();
  console.log(`\n💾 Hash cache saved: ${hashCache.getCachePath()}`);

  console.log("\n✨ All API clients generated successfully!");
  console.log(`\n📂 Output directory: ${outputDir}`);
  console.log("\n📚 Usage example:");
  console.log(`import { applicationsApi } from './${relative(process.cwd(), join(outputDir, "applications"))}';\n`);
  console.log(`const data = await applicationsApi.getCompetitors({ params: { page: 1 } });`);

  if (mswOutputDir && (force || changedFiles.length > 0)) {
    console.log("\n🎭 Generating MSW handlers...");
    await generateMSWHandlers(parsedChangedFiles, mswOutputDir);
  } else if (mswOutputDir) {
    console.log("ℹ️  MSW generation skipped (no changed files)");
  }
}

/**
 * MSW 핸들러 생성
 */
async function generateMSWHandlers(
  parsedFiles: Array<{ filePath: string; parsed: any; domain: string }>,
  mswOutputDir: string,
): Promise<void> {
  // MSW 출력 디렉토리 생성
  mkdirSync(mswOutputDir, { recursive: true });

  // 도메인별로 핸들러 그룹화
  const domainHandlers = new Map<string, Array<{ fileName: string; content: string }>>();

  for (const { filePath, parsed, domain } of parsedFiles) {
    const handler = generateMSWHandler(parsed, filePath, domain);

    // MSW 핸들러는 항상 생성 (docs 없어도 기본 응답 사용)
    if (!handler) {
      continue;
    }

    if (!domainHandlers.has(domain)) {
      domainHandlers.set(domain, []);
    }

    domainHandlers.get(domain)!.push({
      fileName: handler.fileName,
      content: handler.content,
    });
  }

  // 도메인별 디렉토리 및 파일 생성
  const domains: string[] = [];

  for (const [domain, handlers] of domainHandlers.entries()) {
    domains.push(domain);

    // 도메인 디렉토리 생성
    const domainDir = join(mswOutputDir, domain);
    mkdirSync(domainDir, { recursive: true });

    // 각 핸들러 파일 작성
    const handlerInfos: Array<{ fileName: string; handlerName: string }> = [];

    for (const handler of handlers) {
      const handlerPath = join(domainDir, handler.fileName);
      writeFileSync(handlerPath, handler.content, "utf-8");
      console.log(`✅ MSW Generated: ${handlerPath}`);

      handlerInfos.push({
        fileName: handler.fileName,
        handlerName: handler.fileName.replace(".ts", ""),
      });
    }

    // 도메인별 index 파일 생성
    const domainIndexContent = generateDomainHandlersIndex(domain, handlerInfos);
    const domainIndexPath = join(domainDir, "index.ts");
    writeFileSync(domainIndexPath, domainIndexContent, "utf-8");
    console.log(`✅ MSW Index Generated: ${domainIndexPath}`);
  }

  // 전체 handlers index 파일 생성
  if (domains.length > 0) {
    const mswIndexContent = generateMSWIndex(domains);
    const mswIndexPath = join(mswOutputDir, "handlers.ts");
    writeFileSync(mswIndexPath, mswIndexContent, "utf-8");
    console.log(`✅ MSW Main Index Generated: ${mswIndexPath}`);

    console.log(`\n🎭 MSW handlers generated successfully!`);
    console.log(`📂 MSW Output directory: ${mswOutputDir}`);
    console.log(`\n📚 Usage example:`);
    console.log(`import { handlers } from './${relative(process.cwd(), mswIndexPath).replace(".ts", "")}';\n`);
    console.log(`const worker = setupWorker(...handlers);`);
  } else {
    console.log(`ℹ️  No MSW handlers generated`);
  }
}
