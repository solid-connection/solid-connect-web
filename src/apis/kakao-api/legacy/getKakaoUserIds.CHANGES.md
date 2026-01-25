# 변경사항: getKakaoUserIds.ts

## 변경 일시
2026-01-25

## API 정보
- URL: https://kapi.kakao.com/v1/user/ids?order=dsc
- Method: GET
- Function: getKakaoUserIds

## 변경 내용

### query-key

**QueryKey 변경**

- 이전: `QueryKeys["kakao-api"`
- 현재: `QueryKeys.kakao-api.getKakaoUserIds, params`

## 권장 조치

1. `legacy/getKakaoUserIds.ts` 파일의 비즈니스 로직 확인
2. 새 `getKakaoUserIds.ts` 파일과 비교
3. 필요한 커스텀 로직을 새 파일에 수동 병합
4. 병합 완료 후 `legacy/getKakaoUserIds.ts` 파일 삭제