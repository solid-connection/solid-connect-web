# 변경사항: postSignOut.ts

## 변경 일시
2026-01-25

## API 정보
- URL: {{URL}}/auth/sign-out
- Method: POST
- Function: postSignOut

## 변경 내용

### request-type

**Request 타입 변경**

- 이전: `void`
- 현재: `SignOutRequest`

## 권장 조치

1. `legacy/postSignOut.ts` 파일의 비즈니스 로직 확인
2. 새 `postSignOut.ts` 파일과 비교
3. 필요한 커스텀 로직을 새 파일에 수동 병합
4. 병합 완료 후 `legacy/postSignOut.ts` 파일 삭제