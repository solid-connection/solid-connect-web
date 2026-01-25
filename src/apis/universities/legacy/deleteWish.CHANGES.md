# 변경사항: deleteWish.ts

## 변경 일시
2026-01-25

## API 정보
- URL: {{URL}}/univ-apply-infos/{{univ-apply-info-id}}/like
- Method: DELETE
- Function: deleteWish

## 변경 내용

### query-key

**QueryKey 변경**

- 이전: `QueryKeys.universities.wishList`
- 현재: `QueryKeys.universities.deleteWish, URL, params`

## 권장 조치

1. `legacy/deleteWish.ts` 파일의 비즈니스 로직 확인
2. 새 `deleteWish.ts` 파일과 비교
3. 필요한 커스텀 로직을 새 파일에 수동 병합
4. 병합 완료 후 `legacy/deleteWish.ts` 파일 삭제