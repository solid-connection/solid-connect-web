export const convertISODateToDate = (isoDate: string) => {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  // "YYYY. M. D." 형식으로 포맷
  return `${year}. ${month}. ${day}.`;
};

export const convertISODateToDateTime = (isoDate: string) => {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  // "YYYY. M. D. HH:MM" 형식으로 포맷
  return `${year}. ${month}. ${day}. ${hour}:${minute}`;
};

// 오전 HH:MM 형식으로 변환
export const convertISODateToKoreanTime = (isoDate: string) => {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  let hour = date.getHours();
  const minute = String(date.getMinutes()).padStart(2, "0");
  const period = hour < 12 ? "오전" : "오후";

  hour = hour % 12 || 12; // 0시는 12시로 표시

  return `${period} ${String(hour).padStart(2, "0")}:${minute}`;
};
