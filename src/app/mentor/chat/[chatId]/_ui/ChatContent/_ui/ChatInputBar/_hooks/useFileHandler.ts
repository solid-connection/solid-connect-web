import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

// Zod 스키마 정의
const fileSchema = z.object({
  files: z.array(z.instanceof(File)).min(1, "파일을 선택해주세요"),
});

// 타입 정의
type FileForm = z.infer<typeof fileSchema>;

type UseFileHandlerProps = {
  onSendFiles: (data: { files: File[] }) => void;
  setIsAttachmentOptionsOpen: (isOpen: boolean) => void;
};

const useFileHandler = ({ onSendFiles, setIsAttachmentOptionsOpen }: UseFileHandlerProps) => {
  // 파일용 폼
  const fileForm = useForm<FileForm>({
    resolver: zodResolver(fileSchema),
  });

  // state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일이 있는지 여부
  const hasFiles = selectedFiles.length > 0;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles(fileArray);
      // 파일 선택 시 첨부파일 옵션 닫기
      setIsAttachmentOptionsOpen(false);
    }
  };

  const handleFileClick = () => {
    // 파일 선택 트리거
    fileInputRef.current?.click();
  };

  const onSubmitFiles = (data: FileForm) => {
    console.log("파일 전송:", data);
    onSendFiles(data);
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return {
    fileInputRef,
    selectedFiles,
    setSelectedFiles,
    fileForm,
    onSubmitFiles,
    hasFiles,
    handleFileChange,
    handleFileClick,
  };
};

export default useFileHandler;
