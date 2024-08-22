export const convertISODateToDate = (isoDate: string) => {
  const date = new Date(isoDate);

  if (isNaN(date.getTime())) {
    return null;
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // "YYYY. M. D." 형식으로 포맷
  return `${year}. ${month}. ${day}.`;
};

export const convertISODateToDateTime = (isoDate: string) => {
  const date = new Date(isoDate);

  if (isNaN(date.getTime())) {
    return null;
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();

  // "YYYY. M. D. HH:MM" 형식으로 포맷
  return `${year}. ${month}. ${day}. ${hour}:${minute}`;
};

export const convertBirth = (value: string): string => {
  // 20010101 방식의 생년월일을 "YYYY-MM-DD" 형식으로 변환
  // 입력값이 8자리인지 확인
  if (value.length !== 8) {
    throw new Error("생년월일을 8자리로 입력해주세요.");
  }

  // 년, 월, 일을 분리
  const year = value.substring(0, 4);
  const month = value.substring(4, 6);
  const day = value.substring(6, 8);

  // "YYYY-MM-DD" 형식으로 변환
  const formattedDate = `${year}-${month}-${day}`;

  // 날짜 유효성 검증
  const date = new Date(formattedDate);
  const isValidDate =
    date.getFullYear() === parseInt(year, 10) &&
    date.getMonth() + 1 === parseInt(month, 10) &&
    date.getDate() === parseInt(day, 10);

  if (!isValidDate) {
    throw new Error("유효한 날짜가 아닙니다.");
  }

  return formattedDate;
};
