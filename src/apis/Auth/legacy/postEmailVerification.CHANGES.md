# 변경사항: postEmailVerification.ts

## 변경 일시
2026-01-25

## API 정보
- URL: {{URL}}/auth/email/sign-up
- Method: POST
- Function: postEmailVerification

## 변경 내용

### response-type

**Response 타입 변경**

- 이전: `EmailSignUpResponse`
- 현재: `EmailVerificationResponse`

### request-type

**Request 타입 변경**

- 이전: `EmailSignUpRequest`
- 현재: `EmailVerificationRequest`

## 권장 조치

1. `legacy/postEmailVerification.ts` 파일의 비즈니스 로직 확인
2. 새 `postEmailVerification.ts` 파일과 비교
3. 필요한 커스텀 로직을 새 파일에 수동 병합
4. 병합 완료 후 `legacy/postEmailVerification.ts` 파일 삭제