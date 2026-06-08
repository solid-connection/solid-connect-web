// 에러 메시지 추출 함수
const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  return "";
};
export default getErrorMessage;
