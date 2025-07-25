export const isTokenExpired = (token: string): boolean => {
  if (!token) {
    return true;
  }
  try {
    // JWT의 payload 부분을 디코딩합니다 (Base64URL 디코딩)
    const payload = JSON.parse(atob(token.split(".")[1]));

    // 현재 시간 (초 단위로)
    const currentTime = Math.floor(Date.now() / 1000);

    // 토큰의 만료 시간 (`exp` 클레임)
    const { exp } = payload;

    // 토큰이 만료되었는지 확인
    return exp < currentTime;
  } catch (error) {
    console.error("인증 토큰에 문제가 있습니다:", error);
    // 토큰이 잘못된 경우 만료된 것으로 간주
    return true;
  }
};

export const decodeExp = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const { exp } = payload;
    return exp * 1000; // → ms
  } catch {
    return 0;
  }
};
