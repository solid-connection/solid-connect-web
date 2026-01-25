# 변경사항: postUploadProfileImageBeforeSignup.ts

## 변경 일시
2026-01-25

## API 정보
- URL: {{URL}}/file/profile/pre
- Method: POST
- Function: postUploadProfileImageBeforeSignup

## 변경 내용

### response-type

**Response 타입 변경**

- 이전: `FileResponse`
- 현재: `UploadProfileImageBeforeSignupResponse`

### request-type

**Request 타입 변경**

- 이전: `File`
- 현재: `UploadProfileImageBeforeSignupRequest`

## 권장 조치

1. `legacy/postUploadProfileImageBeforeSignup.ts` 파일의 비즈니스 로직 확인
2. 새 `postUploadProfileImageBeforeSignup.ts` 파일과 비교
3. 필요한 커스텀 로직을 새 파일에 수동 병합
4. 병합 완료 후 `legacy/postUploadProfileImageBeforeSignup.ts` 파일 삭제