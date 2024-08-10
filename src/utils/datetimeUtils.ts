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
