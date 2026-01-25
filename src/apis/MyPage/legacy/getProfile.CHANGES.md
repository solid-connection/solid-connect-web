# 변경사항: getProfile.ts

## 변경 일시
2026-01-25

## API 정보
- URL: {{URL}}/my
- Method: GET
- Function: getProfile

## 변경 내용

### response-type

**Response 타입 변경**

- 이전: `MyInfoResponse`
- 현재: `ProfileResponse`

### query-key

**QueryKey 변경**

- 이전: `QueryKeys.MyPage.profile`
- 현재: `QueryKeys.myPage.getProfile, URL, params`

## 권장 조치

1. `legacy/getProfile.ts` 파일의 비즈니스 로직 확인
2. 새 `getProfile.ts` 파일과 비교
3. 필요한 커스텀 로직을 새 파일에 수동 병합
4. 병합 완료 후 `legacy/getProfile.ts` 파일 삭제