# 변경사항: getKakaoInfo.ts

## 변경 일시
2026-01-25

## API 정보
- URL: https://kapi.kakao.com/v2/user/me?property_keys=["kakao_account.email"]&target_id_type=user_id&target_id=3715136239
- Method: GET
- Function: getKakaoInfo

## 변경 내용

### query-key

**QueryKey 변경**

- 이전: `QueryKeys["kakao-api"`
- 현재: `QueryKeys.kakao-api.getKakaoInfo, params`

## 권장 조치

1. `legacy/getKakaoInfo.ts` 파일의 비즈니스 로직 확인
2. 새 `getKakaoInfo.ts` 파일과 비교
3. 필요한 커스텀 로직을 새 파일에 수동 병합
4. 병합 완료 후 `legacy/getKakaoInfo.ts` 파일 삭제