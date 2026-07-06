#!/usr/bin/env bash

set -euo pipefail

TARGET="${TARGET:-${1:-}}"
CREATE_TAG="${CREATE_TAG:-true}"

case "$TARGET" in
  web)
    DISPLAY_NAME="Web"
    HEADVER_PATH="apps/web/headver.json"
    RELEASE_BRANCH="release-web"
    TAG_PREFIX="web"
    APP_PATH_REGEX="^(apps/web/|packages/|package\\.json|pnpm-lock\\.yaml|pnpm-workspace\\.yaml|turbo\\.json|vercel\\.json|scripts/)"
    ;;
  admin)
    DISPLAY_NAME="Admin"
    HEADVER_PATH="apps/admin/headver.json"
    RELEASE_BRANCH="release-admin"
    TAG_PREFIX="admin"
    APP_PATH_REGEX="^(apps/admin/|packages/|package\\.json|pnpm-lock\\.yaml|pnpm-workspace\\.yaml|turbo\\.json|vercel\\.json|scripts/)"
    ;;
  university)
    DISPLAY_NAME="University Web"
    HEADVER_PATH="apps/university-web/headver.json"
    RELEASE_BRANCH="release-university"
    TAG_PREFIX="university"
    APP_PATH_REGEX="^(apps/university-web/|packages/|package\\.json|pnpm-lock\\.yaml|pnpm-workspace\\.yaml|turbo\\.json|vercel\\.json|scripts/)"
    ;;
  *)
    echo "Unsupported target: $TARGET" >&2
    exit 1
    ;;
esac

if [ ! -f "$HEADVER_PATH" ]; then
  echo "$HEADVER_PATH 파일이 없습니다." >&2
  exit 1
fi

HEAD=$(jq -r '.head // empty' "$HEADVER_PATH")
if ! [[ "$HEAD" =~ ^[0-9]+$ ]]; then
  echo "$HEADVER_PATH의 head 값이 숫자가 아닙니다: $HEAD" >&2
  exit 1
fi

YYWW="${YYWW_OVERRIDE:-$(date +"%y%V")}"
TAG_PATTERN="${TAG_PREFIX}-v${HEAD}.${YYWW}.*"
LAST_BUILD=$(git tag --list "$TAG_PATTERN" | awk -F. '{print $3}' | sort -n | tail -n 1)

if [ -z "$LAST_BUILD" ]; then
  BUILD=1
else
  BUILD=$((LAST_BUILD + 1))
fi

VERSION="${HEAD}.${YYWW}.${BUILD}"
TAG="${TAG_PREFIX}-v${VERSION}"

echo "Target: $TARGET"
echo "HeadVer path: $HEADVER_PATH"
echo "Computed tag: $TAG"

if [ "$CREATE_TAG" = "true" ]; then
  git tag "$TAG"
  git push origin "$TAG"
fi

OUTPUT_FILE="${GITHUB_OUTPUT:-/dev/stdout}"
{
  echo "target=$TARGET"
  echo "display_name=$DISPLAY_NAME"
  echo "headver_path=$HEADVER_PATH"
  echo "release_branch=$RELEASE_BRANCH"
  echo "tag_prefix=$TAG_PREFIX"
  echo "path_regex=$APP_PATH_REGEX"
  echo "version=$VERSION"
  echo "tag=$TAG"
} >> "$OUTPUT_FILE"
