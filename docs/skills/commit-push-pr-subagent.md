# Skill: Commit + Push + PR Subagent

## Goal

한 번의 실행으로 변경사항을 커밋하고, 원격에 푸시한 뒤, PR까지 생성한다.

## Inputs

- `branch`: 작업 브랜치명 (예: `parser`)
- `base`: PR 기준 브랜치 (기본값 `main`)
- `title`: PR 제목
- `summary`: PR 본문 요약 bullet (1~3개)

## Required Checks

1. 작업 브랜치 확인: `git branch --show-current`
2. 변경사항 확인: `git status --short --branch`, `git diff --stat`
3. 커밋 스타일 준수: 저장소 규칙(`<type>: <subject>`) 사용
4. 커밋 메시지와 PR 제목/본문은 한국어로 작성

## Execution Steps

```bash
git add <files>
git commit -m "docs: 커밋/푸시/PR 서브에이전트 스킬 문서 추가"
git push -u origin <branch>
gh pr create --base <base> --head <branch> --title "<title>" --body "$(cat <<'EOF'
## 요약
- <요약 항목 1>
- <요약 항목 2>
EOF
)"
```

## Safety Rules

- 이미 원격에 있는 브랜치라도 강제 푸시(`--force`)는 기본적으로 사용하지 않는다.
- 커밋에는 의도하지 않은 생성 산출물(`.output`, `.next`, `node_modules`)을 포함하지 않는다.
- PR 생성 전 `git status`가 clean인지 확인한다.

## Output Contract

- 생성된 커밋 해시
- 푸시 결과(업스트림 연결 여부)
- PR URL

## Language Policy

- 커밋 메시지는 한국어를 기본으로 사용한다.
- PR 제목과 본문은 한국어로 작성한다.
- 영문 용어가 필요한 경우에도 설명 문장은 한국어로 유지한다.
