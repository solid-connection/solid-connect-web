# 솔리드 커넥션 웹

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Clsx
- Axios
- Biome (Linter & Formatter)
- Vercel

## Prerequisites

- Node.js 22.x
- pnpm 9.x or later

## Installation

This project uses pnpm as the package manager.

```bash
# Install pnpm globally
npm install -g pnpm

# Install dependencies
pnpm install
```

## Commands

```bash
# Development server
pnpm run dev

# Build for production
pnpm run build

# Lint and auto-fix
pnpm run lint

# Lint check only (no fix)
pnpm run lint:check

# Format code
pnpm run format

# Format check only (no write)
pnpm run format:check

# Type checking
pnpm run typecheck

# Run all checks (CI)
pnpm run ci:check

# Fix all (lint + format)
pnpm run fix:all
```

## Migration from npm

If you have an existing clone:

```bash
rm -rf node_modules package-lock.json
pnpm install
```

## University Web Revalidation

대학 지원 정보가 변경된 뒤 배포 없이 `university-web`의 정적 캐시를 무효화하려면 `POST /university/revalidate`를 호출한다.

### Environment

Vercel의 `solid-connect-university-web` 프로젝트에 다음 환경 변수가 필요하다.

```bash
REVALIDATE_SECRET=your-secret
```

### Authentication

다음 두 방식 중 하나로 secret을 전달할 수 있다.

```bash
Authorization: Bearer ${REVALIDATE_SECRET}
```

```bash
x-revalidate-secret: ${REVALIDATE_SECRET}
```

### Revalidate All University Pages

```bash
curl -X POST "https://www.solid-connection.com/university/revalidate" \
  -H "Authorization: Bearer ${REVALIDATE_SECRET}" \
  -H "Content-Type: application/json" \
  --data '{"scope":"university"}'
```

### Revalidate Home University Pages

```bash
curl -X POST "https://www.solid-connection.com/university/revalidate" \
  -H "Authorization: Bearer ${REVALIDATE_SECRET}" \
  -H "Content-Type: application/json" \
  --data '{"scope":"home-university","homeUniversity":"kyunghee"}'
```

### Revalidate One Path

```bash
curl -X POST "https://www.solid-connection.com/university/revalidate" \
  -H "Authorization: Bearer ${REVALIDATE_SECRET}" \
  -H "Content-Type: application/json" \
  --data '{"scope":"path","path":"/university/kyunghee"}'
```

### Response

```json
{
  "revalidated": true,
  "paths": ["/university/kyunghee", "/university/kyunghee/search"]
}
```

`revalidatePath`는 캐시를 무효화한다. 새 HTML은 API 호출 시점이 아니라 해당 페이지에 다음 요청이 들어올 때 다시 생성된다.
