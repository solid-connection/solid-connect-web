# 변경사항: postUploadLanguageTestReport.ts

## 변경 일시
2026-01-25

## API 정보
- URL: {{URL}}/file/language-test
- Method: POST
- Function: postUploadLanguageTestReport

## 변경 내용

### request-type

**Request 타입 변경**

- 이전: `File`
- 현재: `UploadLanguageTestReportRequest`

## 권장 조치

1. `legacy/postUploadLanguageTestReport.ts` 파일의 비즈니스 로직 확인
2. 새 `postUploadLanguageTestReport.ts` 파일과 비교
3. 필요한 커스텀 로직을 새 파일에 수동 병합
4. 병합 완료 후 `legacy/postUploadLanguageTestReport.ts` 파일 삭제