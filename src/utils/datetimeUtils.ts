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
