# 변경사항: postBlockUser.ts

## 변경 일시
2026-01-25

## API 정보
- URL: {{URL}}/users/block/{{blocked-id}}
- Method: POST
- Function: postBlockUser

## 변경 내용

### request-type

**Request 타입 변경**

- 이전: `{ blockedId: string | number; data: BlockUserRequest }`
- 현재: `BlockUserRequest`

## 권장 조치

1. `legacy/postBlockUser.ts` 파일의 비즈니스 로직 확인
2. 새 `postBlockUser.ts` 파일과 비교
3. 필요한 커스텀 로직을 새 파일에 수동 병합
4. 병합 완료 후 `legacy/postBlockUser.ts` 파일 삭제