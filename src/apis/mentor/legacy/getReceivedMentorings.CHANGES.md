# 변경사항: getReceivedMentorings.ts

## 변경 일시
2026-01-25

## API 정보
- URL: {{URL}}/mentor/mentorings
- Method: GET
- Function: getReceivedMentorings

## 변경 내용

### response-type

**Response 타입 변경**

- 이전: `MentoringListResponse`
- 현재: `ReceivedMentoringsResponse`

### query-key

**QueryKey 변경**

- 이전: `MentorQueryKeys.mentoringList, size`
- 현재: `QueryKeys.mentor.getReceivedMentorings, URL, params`

## 권장 조치

1. `legacy/getReceivedMentorings.ts` 파일의 비즈니스 로직 확인
2. 새 `getReceivedMentorings.ts` 파일과 비교
3. 필요한 커스텀 로직을 새 파일에 수동 병합
4. 병합 완료 후 `legacy/getReceivedMentorings.ts` 파일 삭제