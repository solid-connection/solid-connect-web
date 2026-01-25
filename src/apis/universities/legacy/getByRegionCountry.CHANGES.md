# 변경사항: getByRegionCountry.ts

## 변경 일시
2026-01-25

## API 정보
- URL: {{URL}}/universities/search
- Method: GET
- Function: getByRegionCountry

## 변경 내용

### query-key

**QueryKey 변경**

- 이전: `QueryKeys.universities.byRegionCountry, params`
- 현재: `QueryKeys.universities.getByRegionCountry, URL, params`

## 권장 조치

1. `legacy/getByRegionCountry.ts` 파일의 비즈니스 로직 확인
2. 새 `getByRegionCountry.ts` 파일과 비교
3. 필요한 커스텀 로직을 새 파일에 수동 병합
4. 병합 완료 후 `legacy/getByRegionCountry.ts` 파일 삭제