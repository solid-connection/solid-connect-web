# 변경사항: getMatchedMentors.ts

## 변경 일시
2026-01-25

## API 정보
- URL: {{URL}}/mentee/mentorings/matched-mentors?size={{default-size}}&page={{default-page}}
- Method: GET
- Function: getMatchedMentors

## 변경 내용

### query-key

**QueryKey 변경**

- 이전: `QueryKeys.mentor.matchedMentors, defaultSize, defaultPage, params`
- 현재: `QueryKeys.mentor.getMatchedMentors, URL, params`

## 권장 조치

1. `legacy/getMatchedMentors.ts` 파일의 비즈니스 로직 확인
2. 새 `getMatchedMentors.ts` 파일과 비교
3. 필요한 커스텀 로직을 새 파일에 수동 병합
4. 병합 완료 후 `legacy/getMatchedMentors.ts` 파일 삭제