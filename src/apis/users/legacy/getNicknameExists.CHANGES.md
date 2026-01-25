# 변경사항: getNicknameExists.ts

## 변경 일시
2026-01-25

## API 정보
- URL: {{URL}}/users/exists?nickname=abc
- Method: GET
- Function: getNicknameExists

## 변경 내용

### query-key

**QueryKey 변경**

- 이전: `QueryKeys.users.nicknameExists, params`
- 현재: `QueryKeys.users.getNicknameExists, URL, params`

## 권장 조치

1. `legacy/getNicknameExists.ts` 파일의 비즈니스 로직 확인
2. 새 `getNicknameExists.ts` 파일과 비교
3. 필요한 커스텀 로직을 새 파일에 수동 병합
4. 병합 완료 후 `legacy/getNicknameExists.ts` 파일 삭제