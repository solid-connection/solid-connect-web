import { normalizeImageUrlToUploadCdn } from "@/utils/cdnUrl";

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
    return;
  }

  try {
    const res = await fetch(url, { credentials: "include" });
    if (!res.ok) {
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
  } catch (err) {}
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

export const convertUploadedImageUrl = (url: string | null | undefined): string => {
  return normalizeImageUrlToUploadCdn(url);
};

export const convertImageUrl = (url: string | null | undefined): string => {
  return normalizeImageUrlToUploadCdn(url);
};
