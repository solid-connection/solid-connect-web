// 파일명에서 확장자 추출
export const getFileExtension = (url: string) => {
  return url.split(".").pop()?.toUpperCase() || "FILE";
};

// 파일명의 앞 8글자 추출
export const getFileNamePrefix = (url: string) => {
  const fileName = url.split("/").pop()?.split("?")[0] || "파일";
  const lastDotIndex = fileName.lastIndexOf(".");
  const nameWithoutExtension = lastDotIndex > 0 ? fileName.substring(0, lastDotIndex) : fileName;

  // URL 디코딩 시도
  try {
    const decoded = decodeURIComponent(nameWithoutExtension);
    return decoded.length > 8 ? decoded.substring(0, 8) : decoded;
  } catch {
    return nameWithoutExtension.length > 8 ? nameWithoutExtension.substring(0, 8) : nameWithoutExtension;
  }
};

// 파일 다운로드 함수 (URL용)
export const downloadFile = async (url: string, fileName?: string) => {
  try {
    new URL(url);
  } catch (error) {
    console.error("유효하지 않은 URL입니다:", error);
    return;
  }

  try {
    const res = await fetch(url, { credentials: "include" });
    if (!res.ok) {
      console.error("파일을 가져오지 못했습니다:", res.status);
      return;
    }
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName || "download";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error("다운로드 중 오류:", err);
  }
};

// 로컬 파일 다운로드 함수 (File 객체용)
export const downloadLocalFile = (file: File, fileName?: string) => {
  const blobUrl = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = fileName || file.name;
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl);
};

const NEXT_PUBLIC_UPLOADED_IMAGE_URL = process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL;
const NEXT_PUBLIC_IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL;

export const convertUploadedImageUrl = (url: string | null | undefined): string => {
  if (!url) return "";
  if (!NEXT_PUBLIC_UPLOADED_IMAGE_URL) {
    console.error("NEXT_PUBLIC_UPLOADED_IMAGE_URL is not defined");
    return url;
  }
  return `${NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${url}`;
};

export const convertImageUrl = (url: string | null | undefined): string => {
  if (!url) return "";
  if (!NEXT_PUBLIC_IMAGE_URL) {
    console.error("NEXT_PUBLIC_IMAGE_URL is not defined");
    return url;
  }
  return `${NEXT_PUBLIC_IMAGE_URL}/${url}`;
};
