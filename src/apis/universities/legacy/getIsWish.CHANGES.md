# 변경사항: getIsWish.ts

## 변경 일시
2026-01-25

## API 정보
- URL: {{URL}}/univ-apply-infos/{{univ-apply-info-id}}/like
- Method: GET
- Function: getIsWish

## 변경 내용

### query-key

**QueryKey 변경**

- 이전: `QueryKeys.universities.isWish, univApplyInfoId, params`
- 현재: `QueryKeys.universities.getIsWish, URL, params`

## 권장 조치

1. `legacy/getIsWish.ts` 파일의 비즈니스 로직 확인
2. 새 `getIsWish.ts` 파일과 비교
3. 필요한 커스텀 로직을 새 파일에 수동 병합
4. 병합 완료 후 `legacy/getIsWish.ts` 파일 삭제