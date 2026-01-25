# 변경사항: getGpaList.ts

## 변경 일시
2026-01-25

## API 정보
- URL: {{URL}}/scores/gpas
- Method: GET
- Function: getGpaList

## 변경 내용

### query-key

**QueryKey 변경**

- 이전: `ScoresQueryKeys.myGpaScore`
- 현재: `QueryKeys.scores.getGpaList, URL, params`

## 권장 조치

1. `legacy/getGpaList.ts` 파일의 비즈니스 로직 확인
2. 새 `getGpaList.ts` 파일과 비교
3. 필요한 커스텀 로직을 새 파일에 수동 병합
4. 병합 완료 후 `legacy/getGpaList.ts` 파일 삭제