# 변경사항: patchMentoringStatus.ts

## 변경 일시
2026-01-25

## API 정보
- URL: {{URL}}/mentor/mentorings/{{mentoring-id}}
- Method: PATCH
- Function: patchMentoringStatus

## 변경 내용

### response-type

**Response 타입 변경**

- 이전: `PatchApprovalStatusResponse`
- 현재: `MentoringStatusResponse`

### request-type

**Request 타입 변경**

- 이전: `PatchApprovalStatusRequest`
- 현재: `MentoringStatusRequest`

### query-key

**QueryKey 변경**

- 이전: `MentorQueryKeys.mentoringList`
- 현재: `QueryKeys.mentor.patchMentoringStatus, URL, params`

## 권장 조치

1. `legacy/patchMentoringStatus.ts` 파일의 비즈니스 로직 확인
2. 새 `patchMentoringStatus.ts` 파일과 비교
3. 필요한 커스텀 로직을 새 파일에 수동 병합
4. 병합 완료 후 `legacy/patchMentoringStatus.ts` 파일 삭제