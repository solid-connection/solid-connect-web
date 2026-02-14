import { createHash } from 'crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface HashEntry {
  hash: string;
  lastGenerated: string;
  outputFiles: string[];
}

export interface HashCache {
  version: string;
  hashes: Record<string, HashEntry>;
}

export class BrunoHashCache {
  private cachePath: string;
  private cacheDir: string;
  private cache: HashCache;

  constructor(outputDir: string) {
    this.cacheDir = join(outputDir, '.bruno-cache');
    this.cachePath = join(this.cacheDir, 'hashes.json');
    this.cache = { version: '1.0', hashes: {} };
  }

  /**
   * 캐시 파일 로드
   */
  load(): void {
    if (existsSync(this.cachePath)) {
      try {
        const content = readFileSync(this.cachePath, 'utf-8');
        this.cache = JSON.parse(content);
      } catch (error) {
        console.warn('⚠️  Failed to load hash cache, using empty cache');
        this.cache = { version: '1.0', hashes: {} };
      }
    } else {
      this.cache = { version: '1.0', hashes: {} };
    }
  }

  /**
   * 캐시 파일 저장
   */
  save(): void {
    try {
      mkdirSync(this.cacheDir, { recursive: true });
      writeFileSync(
        this.cachePath,
        JSON.stringify(this.cache, null, 2),
        'utf-8'
      );
    } catch (error) {
      console.error('❌ Failed to save hash cache:', error);
    }
  }

  /**
   * Bruno 파일의 SHA-256 해시 계산
   * 개행 문자를 정규화하여 OS 간 차이를 방지합니다.
   *
   * @param brunoFilePath - Bruno 파일의 절대 경로
   * @returns 64자 hex string SHA-256 해시
   */
  calculateHash(brunoFilePath: string): string {
    const content = readFileSync(brunoFilePath, 'utf-8');
    // 개행 문자 정규화 (Windows/Unix 호환성)
    const normalized = content.replace(/\r\n/g, '\n').trim();
    return createHash('sha256').update(normalized, 'utf-8').digest('hex');
  }

  /**
   * 이전 해시 조회
   */
  getHash(brunoFilePath: string): string | null {
    return this.cache.hashes[brunoFilePath]?.hash || null;
  }

  /**
   * 해시 저장
   */
  setHash(brunoFilePath: string, hash: string, outputFiles: string[]): void {
    this.cache.hashes[brunoFilePath] = {
      hash,
      lastGenerated: new Date().toISOString(),
      outputFiles,
    };
  }

  /**
   * Bruno 파일 변경 여부 확인
   */
  hasChanged(brunoFilePath: string): boolean {
    // 1. 이전 해시 조회
    const previousHash = this.getHash(brunoFilePath);

    // 2. 캐시가 없으면 변경됨으로 간주 (첫 실행)
    if (!previousHash) {
      return true;
    }

    // 3. 출력 파일 체크 (outputFiles가 빈 배열인 경우는 파싱 실패로 스킵)
    const entry = this.cache.hashes[brunoFilePath];
    if (entry && entry.outputFiles && entry.outputFiles.length > 0) {
      // 출력 파일이 있는 경우에만 존재 여부 확인
      if (!this.hasOutputFile(brunoFilePath)) {
        return true; // 파일이 삭제됨
      }
    }
    // outputFiles가 빈 배열이면 파싱 실패 케이스이므로 파일 체크 스킵

    // 4. 현재 해시 계산 및 비교
    const currentHash = this.calculateHash(brunoFilePath);
    return currentHash !== previousHash;
  }

  /**
   * 출력 파일 존재 여부 확인
   */
  hasOutputFile(brunoFilePath: string): boolean {
    const entry = this.cache.hashes[brunoFilePath];
    if (!entry || !entry.outputFiles || entry.outputFiles.length === 0) {
      return false;
    }
    // 하나라도 존재하면 true
    return entry.outputFiles.some(f => existsSync(f));
  }

  /**
   * 캐시 초기화
   */
  clear(): void {
    this.cache = { version: '1.0', hashes: {} };
  }

  /**
   * 삭제된 Bruno 파일의 캐시 정리
   */
  cleanup(): void {
    const brunoFiles = Object.keys(this.cache.hashes);
    let cleanedCount = 0;

    for (const brunoPath of brunoFiles) {
      if (!existsSync(brunoPath)) {
        delete this.cache.hashes[brunoPath];
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`🗑️  Cleaned up ${cleanedCount} deleted file(s) from cache`);
    }
  }

  /**
   * 캐시 경로 반환 (로깅용)
   */
  getCachePath(): string {
    return this.cachePath;
  }

  /**
   * 통계 정보 반환
   */
  getStats(): { total: number; cached: number } {
    return {
      total: 0, // generateHooks에서 설정
      cached: Object.keys(this.cache.hashes).length,
    };
  }
}
