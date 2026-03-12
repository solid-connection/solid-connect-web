#!/bin/bash

# Bruno-Frontend Cross-Repo 자동 연동 설정 스크립트

set -e

echo "🚀 Bruno-Frontend Cross-Repo 자동 연동 설정"
echo "============================================"
echo ""

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 현재 저장소 타입 확인
echo -e "${BLUE}현재 저장소 타입을 선택하세요:${NC}"
echo "1) Bruno 저장소 (백엔드)"
echo "2) 프론트엔드 저장소"
echo ""
read -p "선택 (1 또는 2): " REPO_TYPE

if [ "$REPO_TYPE" = "1" ]; then
    echo ""
    echo -e "${GREEN}=== Bruno 저장소 설정 ===${NC}"
    echo ""

    # 프론트엔드 저장소 정보 입력
    read -p "프론트엔드 저장소 (예: myorg/frontend-repo): " FRONTEND_REPO

    # Workflow 파일 생성
    WORKFLOW_DIR=".github/workflows"
    mkdir -p "$WORKFLOW_DIR"

    echo ""
    echo -e "${BLUE}Workflow 파일 생성 중...${NC}"

    cat > "$WORKFLOW_DIR/notify-frontend.yml" << EOF
name: Notify Frontend on Bruno Changes

on:
  push:
    branches:
      - main
    paths:
      - 'bruno/**'

jobs:
  notify:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Notify Frontend Repository
        run: |
          curl -X POST \\
            -H "Accept: application/vnd.github+json" \\
            -H "Authorization: Bearer \${{ secrets.FRONTEND_REPO_TOKEN }}" \\
            https://api.github.com/repos/${FRONTEND_REPO}/dispatches \\
            -d '{
              "event_type": "bruno_updated",
              "client_payload": {
                "bruno_repo": "\${{ github.repository }}",
                "commit_sha": "\${{ github.sha }}",
                "commit_message": "\${{ github.event.head_commit.message }}",
                "author": "\${{ github.event.head_commit.author.name }}"
              }
            }'

      - name: Notify Complete
        run: |
          echo "✅ Frontend repository notified!"
          echo "🔗 Check: https://github.com/${FRONTEND_REPO}/actions"
EOF

    echo -e "${GREEN}✅ Workflow 파일 생성 완료: $WORKFLOW_DIR/notify-frontend.yml${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  다음 단계:${NC}"
    echo ""
    echo "1. GitHub Personal Access Token 생성"
    echo "   - https://github.com/settings/tokens"
    echo "   - 권한: repo, workflow"
    echo ""
    echo "2. Bruno 저장소 Settings → Secrets → Actions"
    echo "   - New repository secret 클릭"
    echo "   - Name: FRONTEND_REPO_TOKEN"
    echo "   - Value: 생성한 Token 붙여넣기"
    echo ""
    echo "3. Git Commit & Push"
    echo "   git add .github/workflows/notify-frontend.yml"
    echo "   git commit -m 'chore: add frontend notification workflow'"
    echo "   git push"
    echo ""

elif [ "$REPO_TYPE" = "2" ]; then
    echo ""
    echo -e "${GREEN}=== 프론트엔드 저장소 설정 ===${NC}"
    echo ""

    # Bruno 저장소 정보 입력
    read -p "Bruno 저장소 (예: myorg/bruno-repo): " BRUNO_REPO
    read -p "OpenAPI 출력 경로 (예: public/openapi.json): " OPENAPI_PATH
    read -p "Swagger UI URL (예: https://myorg.github.io/myrepo): " SWAGGER_URL

    # Workflow 파일 생성
    WORKFLOW_DIR=".github/workflows"
    mkdir -p "$WORKFLOW_DIR"

    echo ""
    echo -e "${BLUE}Workflow 파일 생성 중...${NC}"

    # 디렉토리 경로 추출
    OPENAPI_DIR=$(dirname "$OPENAPI_PATH")

    cat > "$WORKFLOW_DIR/sync-bruno.yml" << EOF
name: Sync Bruno API Changes

on:
  repository_dispatch:
    types: [bruno_updated]
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3
        with:
          token: \${{ secrets.GITHUB_TOKEN }}

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Clone Bruno Repository
        run: |
          git clone https://github.com/${BRUNO_REPO}.git /tmp/bruno

      - name: Install Dependencies
        run: npm install

      - name: Generate OpenAPI
        run: |
          mkdir -p ${OPENAPI_DIR}

          if [ -f ${OPENAPI_PATH} ]; then
            cp ${OPENAPI_PATH} ${OPENAPI_PATH}.old
          fi

          npx bruno-sync generate \\
            -i /tmp/bruno/bruno \\
            -o ${OPENAPI_PATH} \\
            --title "우리팀 API" \\
            --diff \\
            --changelog ${OPENAPI_DIR}/CHANGELOG.md

          npx bruno-sync generate \\
            -i /tmp/bruno/bruno \\
            -o ${OPENAPI_PATH} \\
            --diff \\
            --changelog ${OPENAPI_DIR}/changelog.html \\
            --changelog-format html

      - name: Check Changes
        id: changes
        run: |
          git add ${OPENAPI_DIR}/
          if git diff --staged --quiet; then
            echo "has_changes=false" >> \$GITHUB_OUTPUT
          else
            echo "has_changes=true" >> \$GITHUB_OUTPUT
            if [ -f ${OPENAPI_DIR}/CHANGELOG.md ] && grep -q "Breaking" ${OPENAPI_DIR}/CHANGELOG.md; then
              echo "has_breaking=true" >> \$GITHUB_OUTPUT
            fi
          fi

      - name: Create Pull Request
        if: steps.changes.outputs.has_changes == 'true'
        uses: peter-evans/create-pull-request@v5
        with:
          commit-message: "chore: sync API spec from Bruno"
          branch: api-sync-\${{ github.event.client_payload.commit_sha || 'manual' }}
          title: "🔄 API 변경사항 동기화"
          body: |
            ## 🔄 Bruno API 변경사항

            **Bruno Repository**: ${BRUNO_REPO}
            **Commit**: \${{ github.event.client_payload.commit_sha || 'manual' }}

            \${{ steps.changes.outputs.has_breaking == 'true' && '### ⚠️ Breaking Changes 발견!' || '' }}

            ### 📝 확인하기
            - [OpenAPI Spec](../blob/\${{ github.ref_name }}/${OPENAPI_PATH})
            - [Changelog](../blob/\${{ github.ref_name }}/${OPENAPI_DIR}/CHANGELOG.md)
            - [Swagger UI](${SWAGGER_URL}/api-viewer.html)

            ### ✅ 체크리스트
            - [ ] Breaking changes 확인
            - [ ] 빌드 테스트
          labels: api-sync,autogenerated
EOF

    echo -e "${GREEN}✅ Workflow 파일 생성 완료: $WORKFLOW_DIR/sync-bruno.yml${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  다음 단계:${NC}"
    echo ""
    echo "1. Git Commit & Push"
    echo "   git add .github/workflows/sync-bruno.yml"
    echo "   git commit -m 'chore: add Bruno sync workflow'"
    echo "   git push"
    echo ""
    echo "2. Bruno 저장소에서 설정 완료되면 자동으로 동작합니다!"
    echo ""

else
    echo -e "${RED}잘못된 선택입니다.${NC}"
    exit 1
fi

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ 설정 완료!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "📚 자세한 내용: docs/CROSS-REPO-SYNC.md"
