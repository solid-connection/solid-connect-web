# Skill: `fix/issues-405-409` 리베이스 플레이북

## 목적

`fix/issues-405-409` 브랜치를 최신 기준 브랜치에 안전하게 리베이스하고, 충돌 해결 기준을 일관되게 적용한다.

## 전제

- 워킹 트리는 반드시 clean 상태여야 한다.
- 이 저장소에는 `develop` 브랜치가 없고 기본 브랜치는 `main`이다.
- 따라서 "develop 리베이스" 요청은 `origin/main` 기준 리베이스로 처리한다.

## 실행 절차

```bash
git checkout fix/issues-405-409
git fetch --all --prune
git rebase origin/main
```

## 충돌 해결 규칙 (이번 리베이스 결과 기반)

### 1) `apps/web/src/components/ui/UniverSityCard/index.tsx`

- `university` 이름 `span`에 `aria-label={convertedKoreanName}`를 유지한다.
- 국가/지역/모집 인원/어학 요건 렌더링 블록은 중복 없이 한 번만 남긴다.

### 2) `pnpm-lock.yaml`

- `origin/main` 쪽 lock 내용을 우선 적용한다.
- 충돌 시 전체 파일 기준 `--ours` 전략으로 정리한다.

```bash
git checkout --ours pnpm-lock.yaml
git add apps/web/src/components/ui/UniverSityCard/index.tsx pnpm-lock.yaml
git rebase --continue
```

## 완료 검증

```bash
git status --short --branch
git rev-list --left-right --count origin/main...HEAD
git log --oneline --max-count=12
```

- 기대값: `origin/main...HEAD` 결과가 `0 7` (기준 브랜치 대비 feature 커밋 7개만 남음)
- 원격 feature 브랜치와 히스토리가 달라지므로 push 시 `--force-with-lease`를 사용한다.

```bash
git push --force-with-lease origin fix/issues-405-409
```
