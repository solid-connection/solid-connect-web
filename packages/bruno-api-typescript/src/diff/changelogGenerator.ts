/**
 * Changelog 자동 생성
 * Markdown, JSON, HTML 형식 지원
 */

import { writeFileSync } from 'fs';
import { ChangeReport, EndpointChange, FieldChange, groupChangesByDomain } from './changeDetector';

export type ChangelogFormat = 'markdown' | 'json' | 'html';

export interface ChangelogOptions {
  format?: ChangelogFormat;
  output: string;
  breakingOnly?: boolean;
}

/**
 * Changelog 생성
 */
export function generateChangelog(report: ChangeReport, options: ChangelogOptions): void {
  const format = options.format || 'markdown';

  let content: string;

  switch (format) {
    case 'markdown':
      content = generateMarkdown(report, options.breakingOnly);
      break;
    case 'json':
      content = generateJson(report, options.breakingOnly);
      break;
    case 'html':
      content = generateHtml(report, options.breakingOnly);
      break;
    default:
      throw new Error(`Unsupported format: ${format}`);
  }

  writeFileSync(options.output, content, 'utf-8');
  console.log(`✅ Changelog generated: ${options.output}`);
}

/**
 * Markdown 형식 생성
 */
function generateMarkdown(report: ChangeReport, breakingOnly?: boolean): string {
  const lines: string[] = [];

  lines.push('# API Changelog\n');
  lines.push(`**Generated**: ${new Date(report.timestamp).toLocaleString()}\n`);

  // 요약
  lines.push('## 📊 Summary\n');
  lines.push('| Type | Count |');
  lines.push('|------|-------|');
  lines.push(`| ✨ Added | ${report.summary.added} |`);
  lines.push(`| 🗑️ Removed | ${report.summary.removed} |`);
  lines.push(`| 🔄 Modified | ${report.summary.modified} |`);
  lines.push(`| ⚠️ **Breaking Changes** | **${report.summary.breaking}** |\n`);

  // 변경사항 필터링
  let changes = report.changes;
  if (breakingOnly) {
    changes = changes.filter((c) => c.severity === 'breaking');
  }

  if (changes.length === 0) {
    lines.push('_No changes detected._\n');
    return lines.join('\n');
  }

  // Breaking changes 섹션
  const breakingChanges = changes.filter((c) => c.severity === 'breaking');
  if (breakingChanges.length > 0) {
    lines.push('## ⚠️ Breaking Changes\n');
    lines.push('> **주의**: 이 변경사항들은 기존 코드를 깨뜨릴 수 있습니다!\n');

    for (const change of breakingChanges) {
      lines.push(`#### ⚠️ \`${change.method} ${change.path}\`\n`);

      if (change.changes && change.changes.length > 0) {
        lines.push('**변경사항**:\n');
        for (const fc of change.changes) {
          lines.push(`- ${formatFieldChange(fc)}`);
        }
        lines.push('');

        // 마이그레이션 가이드
        lines.push('**마이그레이션 가이드**:\n');
        lines.push('```typescript');
        lines.push('// Before');
        for (const fc of change.changes) {
          if (fc.type === 'removed') {
            lines.push(`// ${fc.path} // ❌ This field no longer exists`);
          } else if (fc.type === 'type-changed') {
            lines.push(`// ${fc.path}: ${fc.oldValue}`);
          }
        }
        lines.push('');
        lines.push('// After');
        for (const fc of change.changes) {
          if (fc.type === 'type-changed') {
            lines.push(`// ${fc.path}: ${fc.newValue} // ⚠️ Type changed!`);
          }
        }
        lines.push('```\n');
      } else {
        lines.push(`${change.description}\n`);
      }
    }
  }

  // 도메인별로 그룹화
  const grouped = groupChangesByDomain(changes);

  for (const [domain, domainChanges] of grouped.entries()) {
    lines.push(`## 📁 ${domain.charAt(0).toUpperCase() + domain.slice(1)}\n`);

    // Added
    const added = domainChanges.filter((c) => c.type === 'added');
    if (added.length > 0) {
      lines.push('### ✨ Added\n');
      for (const change of added) {
        lines.push(`#### ✨ \`${change.method} ${change.path}\`\n`);
        lines.push(`${change.description}\n`);
      }
    }

    // Modified (non-breaking)
    const modified = domainChanges.filter(
      (c) => c.type === 'modified' && c.severity !== 'breaking'
    );
    if (modified.length > 0) {
      lines.push('### 🔄 Modified\n');
      for (const change of modified) {
        lines.push(`#### 🔄 \`${change.method} ${change.path}\`\n`);

        if (change.changes && change.changes.length > 0) {
          lines.push('**변경사항**:\n');
          for (const fc of change.changes) {
            lines.push(`- ${formatFieldChange(fc)}`);
          }
          lines.push('');
        }
      }
    }

    // Removed
    const removed = domainChanges.filter((c) => c.type === 'removed');
    if (removed.length > 0) {
      lines.push('### 🗑️ Removed\n');
      for (const change of removed) {
        lines.push(`#### 🗑️ \`${change.method} ${change.path}\`\n`);
        lines.push(`${change.description}\n`);
      }
    }
  }

  return lines.join('\n');
}

/**
 * JSON 형식 생성
 */
function generateJson(report: ChangeReport, breakingOnly?: boolean): string {
  let changes = report.changes;
  if (breakingOnly) {
    changes = changes.filter((c) => c.severity === 'breaking');
  }

  return JSON.stringify(
    {
      ...report,
      changes,
    },
    null,
    2
  );
}

/**
 * HTML 형식 생성
 */
function generateHtml(report: ChangeReport, breakingOnly?: boolean): string {
  let changes = report.changes;
  if (breakingOnly) {
    changes = changes.filter((c) => c.severity === 'breaking');
  }

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API Changelog</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
      padding: 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      padding: 40px;
    }
    h1 {
      color: #2c3e50;
      margin-bottom: 10px;
    }
    .timestamp {
      color: #7f8c8d;
      font-size: 14px;
      margin-bottom: 30px;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }
    .summary-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    .summary-card.breaking {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }
    .summary-card h3 {
      font-size: 14px;
      font-weight: normal;
      margin-bottom: 10px;
      opacity: 0.9;
    }
    .summary-card .count {
      font-size: 36px;
      font-weight: bold;
    }
    .section {
      margin-bottom: 40px;
    }
    .section h2 {
      color: #2c3e50;
      border-bottom: 2px solid #3498db;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    .change-item {
      background: #f8f9fa;
      border-left: 4px solid #3498db;
      padding: 20px;
      margin-bottom: 15px;
      border-radius: 4px;
    }
    .change-item.breaking {
      border-left-color: #e74c3c;
      background: #fff5f5;
    }
    .change-item.added {
      border-left-color: #2ecc71;
    }
    .change-item.removed {
      border-left-color: #e74c3c;
    }
    .change-header {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    .method-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
      margin-right: 10px;
    }
    .method-get { background: #61affe; color: white; }
    .method-post { background: #49cc90; color: white; }
    .method-put { background: #fca130; color: white; }
    .method-delete { background: #f93e3e; color: white; }
    .path {
      font-family: 'Courier New', monospace;
      font-size: 16px;
      font-weight: bold;
    }
    .field-changes {
      margin-top: 15px;
      padding-left: 20px;
    }
    .field-change {
      padding: 5px 0;
      font-family: 'Courier New', monospace;
      font-size: 14px;
    }
    .field-change.added { color: #2ecc71; }
    .field-change.removed { color: #e74c3c; }
    .field-change.modified { color: #f39c12; }
    code {
      background: #2c3e50;
      color: #ecf0f1;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🔍 API Changelog</h1>
    <div class="timestamp">Generated: ${new Date(report.timestamp).toLocaleString()}</div>

    <div class="summary">
      <div class="summary-card">
        <h3>✨ Added</h3>
        <div class="count">${report.summary.added}</div>
      </div>
      <div class="summary-card">
        <h3>🔄 Modified</h3>
        <div class="count">${report.summary.modified}</div>
      </div>
      <div class="summary-card">
        <h3>🗑️ Removed</h3>
        <div class="count">${report.summary.removed}</div>
      </div>
      <div class="summary-card breaking">
        <h3>⚠️ Breaking</h3>
        <div class="count">${report.summary.breaking}</div>
      </div>
    </div>

    ${generateHtmlChanges(changes)}
  </div>
</body>
</html>`;

  return html;
}

/**
 * HTML 변경사항 섹션 생성
 */
function generateHtmlChanges(changes: EndpointChange[]): string {
  const grouped = groupChangesByDomain(changes);
  const sections: string[] = [];

  for (const [domain, domainChanges] of grouped.entries()) {
    sections.push(`<div class="section">`);
    sections.push(`<h2>📁 ${domain.charAt(0).toUpperCase() + domain.slice(1)}</h2>`);

    for (const change of domainChanges) {
      const className = change.severity === 'breaking' ? 'breaking' : change.type;
      sections.push(`<div class="change-item ${className}">`);
      sections.push(`<div class="change-header">`);
      sections.push(
        `<span class="method-badge method-${change.method.toLowerCase()}">${change.method}</span>`
      );
      sections.push(`<span class="path">${change.path}</span>`);
      sections.push(`</div>`);

      if (change.changes && change.changes.length > 0) {
        sections.push(`<div class="field-changes">`);
        for (const fc of change.changes) {
          const fcClass =
            fc.type === 'added' ? 'added' : fc.type === 'removed' ? 'removed' : 'modified';
          sections.push(`<div class="field-change ${fcClass}">`);
          sections.push(formatFieldChange(fc));
          sections.push(`</div>`);
        }
        sections.push(`</div>`);
      }

      sections.push(`</div>`);
    }

    sections.push(`</div>`);
  }

  return sections.join('\n');
}

/**
 * 필드 변경사항 포맷팅
 */
function formatFieldChange(fc: FieldChange): string {
  switch (fc.type) {
    case 'added':
      return `✨ Added: <code>${fc.path}</code> (${fc.newValue})`;
    case 'removed':
      return `🗑️ Removed: <code>${fc.path}</code> (was ${fc.oldValue})`;
    case 'type-changed':
      return `🔄 Type changed: <code>${fc.path}</code> from <code>${fc.oldValue}</code> to <code>${fc.newValue}</code>`;
    case 'required-changed':
      return `📝 Required changed: <code>${fc.path}</code>`;
    default:
      return `Modified: <code>${fc.path}</code>`;
  }
}

/**
 * CLI 콘솔 출력용 포맷팅
 */
export function formatConsoleOutput(report: ChangeReport, breakingOnly?: boolean): string {
  const lines: string[] = [];

  lines.push('\n🔍 API Changes Detected\n');

  // 요약
  lines.push('📊 Summary:');
  lines.push(`   ✨ Added:    ${report.summary.added}`);
  lines.push(`   🗑️  Removed:  ${report.summary.removed}`);
  lines.push(`   🔄 Modified: ${report.summary.modified}`);
  if (report.summary.breaking > 0) {
    lines.push(`   ⚠️  **BREAKING CHANGES**: ${report.summary.breaking}`);
  }
  lines.push('');

  // 변경사항 필터링
  let changes = report.changes;
  if (breakingOnly) {
    changes = changes.filter((c) => c.severity === 'breaking');
  }

  if (changes.length === 0) {
    lines.push('No changes detected.');
    return lines.join('\n');
  }

  lines.push('📝 Detailed Changes:\n');

  // Breaking changes 먼저
  const breaking = changes.filter((c) => c.severity === 'breaking');
  if (breaking.length > 0) {
    lines.push('⚠️  BREAKING CHANGES:');
    for (const change of breaking) {
      lines.push(`   ${change.method.padEnd(6)} ${change.path}`);
      if (change.changes) {
        for (const fc of change.changes) {
          const symbol = fc.type === 'removed' ? '-' : fc.type === 'added' ? '+' : '~';
          lines.push(`      ${symbol} ${fc.path}${formatFieldChangeShort(fc)}`);
        }
      }
    }
    lines.push('');
  }

  // Added
  const added = changes.filter((c) => c.type === 'added');
  if (added.length > 0) {
    lines.push('✨ Added:');
    for (const change of added) {
      lines.push(`   ${change.method.padEnd(6)} ${change.path}`);
    }
    lines.push('');
  }

  // Modified (non-breaking)
  const modified = changes.filter((c) => c.type === 'modified' && c.severity !== 'breaking');
  if (modified.length > 0) {
    lines.push('🔄 Modified:');
    for (const change of modified) {
      lines.push(`   ${change.method.padEnd(6)} ${change.path}`);
      if (change.changes) {
        for (const fc of change.changes) {
          const symbol = fc.type === 'removed' ? '-' : fc.type === 'added' ? '+' : '~';
          lines.push(`      ${symbol} ${fc.path}${formatFieldChangeShort(fc)}`);
        }
      }
    }
    lines.push('');
  }

  // Removed
  const removed = changes.filter((c) => c.type === 'removed');
  if (removed.length > 0) {
    lines.push('🗑️  Removed:');
    for (const change of removed) {
      lines.push(`   ${change.method.padEnd(6)} ${change.path}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * 필드 변경사항 짧은 포맷
 */
function formatFieldChangeShort(fc: FieldChange): string {
  if (fc.type === 'type-changed') {
    return ` (${fc.oldValue} → ${fc.newValue})`;
  }
  return '';
}
