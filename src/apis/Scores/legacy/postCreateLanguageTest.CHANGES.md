# 변경사항: postCreateLanguageTest.ts

## 변경 일시
2026-01-25

## API 정보
- URL: {{URL}}/scores/language-tests
- Method: POST
- Function: postCreateLanguageTest

## 변경 내용

### query-key

**QueryKey 변경**

- 이전: `ScoresQueryKeys.myLanguageTestScore`
- 현재: `QueryKeys.scores.postCreateLanguageTest, URL, params`

## 권장 조치

1. `legacy/postCreateLanguageTest.ts` 파일의 비즈니스 로직 확인
2. 새 `postCreateLanguageTest.ts` 파일과 비교
3. 필요한 커스텀 로직을 새 파일에 수동 병합
4. 병합 완료 후 `legacy/postCreateLanguageTest.ts` 파일 삭제