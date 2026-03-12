export const formatDateSeparator = (dateString: string) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  // Invalid date 체크
  if (Number.isNaN(date.getTime())) {
    console.error("Invalid date string:", dateString);
    return "";
  }

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const dayName = dayNames[date.getDay()];
  return `${year}. ${month}. ${day} ${dayName}`;
};

export const isSameDay = (dateString1: string, dateString2: string) => {
  if (!dateString1 || !dateString2) return false;

  const date1 = new Date(dateString1);
  const date2 = new Date(dateString2);

  // Invalid date 체크
  if (Number.isNaN(date1.getTime()) || Number.isNaN(date2.getTime())) {
    return false;
  }

  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};
