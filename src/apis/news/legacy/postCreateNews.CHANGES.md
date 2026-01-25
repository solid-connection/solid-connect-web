# 변경사항: postCreateNews.ts

## 변경 일시
2026-01-25

## API 정보
- URL: {{URL}}/news
- Method: POST
- Function: postCreateNews

## 변경 내용

### response-type

**Response 타입 변경**

- 이전: `Article`
- 현재: `CreateNewsResponse`

## 권장 조치

1. `legacy/postCreateNews.ts` 파일의 비즈니스 로직 확인
2. 새 `postCreateNews.ts` 파일과 비교
3. 필요한 커스텀 로직을 새 파일에 수동 병합
4. 병합 완료 후 `legacy/postCreateNews.ts` 파일 삭제