# 변경사항: getNewsList.ts

## 변경 일시
2026-01-25

## API 정보
- URL: {{URL}}/news?author-id=6
- Method: GET
- Function: getNewsList

## 변경 내용

### response-type

**Response 타입 변경**

- 이전: `ArticleListResponse`
- 현재: `NewsListResponse`

### query-key

**QueryKey 변경**

- 이전: `NewsQueryKeys.articleList, userId`
- 현재: `QueryKeys.news.getNewsList, URL, params`

## 권장 조치

1. `legacy/getNewsList.ts` 파일의 비즈니스 로직 확인
2. 새 `getNewsList.ts` 파일과 비교
3. 필요한 커스텀 로직을 새 파일에 수동 병합
4. 병합 완료 후 `legacy/getNewsList.ts` 파일 삭제