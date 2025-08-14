// 파일명에서 확장자 추출
export const getFileExtension = (url: string) => {
  return url.split(".").pop()?.toUpperCase() || "FILE";
};

// 파일명의 앞 8글자 추출
export const getFileNamePrefix = (url: string) => {
  const fileName = url.split("/").pop()?.split("?")[0] || "파일";
  const nameWithoutExtension = fileName.split(".")[0];

  // URL 디코딩 시도
  try {
    const decoded = decodeURIComponent(nameWithoutExtension);
    return decoded.length >= 8 ? decoded.substring(0, 8) : decoded;
  } catch {
    return nameWithoutExtension.length >= 8 ? nameWithoutExtension.substring(0, 8) : nameWithoutExtension;
  }
};

// 파일 다운로드 함수
export const downloadFile = (url: string, fileName?: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName || "download";
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
