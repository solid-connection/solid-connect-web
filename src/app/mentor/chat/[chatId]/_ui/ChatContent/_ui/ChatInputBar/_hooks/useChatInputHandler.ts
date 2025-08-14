import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

// Zod 스키마 정의
const messageSchema = z.object({
  message: z.string().min(1, "메시지를 입력해주세요").trim(),
});

const imageSchema = z.object({
  images: z.array(z.instanceof(File)).min(1, "이미지를 선택해주세요"),
});

const fileSchema = z.object({
  files: z.array(z.instanceof(File)).min(1, "파일을 선택해주세요"),
});

// 타입 정의
type MessageForm = z.infer<typeof messageSchema>;
type ImageForm = z.infer<typeof imageSchema>;
type FileForm = z.infer<typeof fileSchema>;

type UseChatInputBarProps = {
  onSendMessage: (data: { message: string }) => void;
  onSendImages: (data: { images: File[] }) => void;
  onSendFiles: (data: { files: File[] }) => void;
  setIsAttachmentOptionsOpen: (isOpen: boolean) => void;
};

const useChatInputHandler = ({
  onSendMessage,
  onSendImages,
  onSendFiles,
  setIsAttachmentOptionsOpen,
}: UseChatInputBarProps) => {
  // 텍스트 메시지용 폼
  const messageForm = useForm<MessageForm>({
    resolver: zodResolver(messageSchema),
    defaultValues: { message: "" },
  });

  // 이미지용 폼
  const imageForm = useForm<ImageForm>({
    resolver: zodResolver(imageSchema),
  });

  // 파일용 폼
  const fileForm = useForm<FileForm>({
    resolver: zodResolver(fileSchema),
  });

  // state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  // ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const watchedMessage = messageForm.watch("message", "");
  // 입력 필드가 비어있는지 여부
  const isEmpty = !watchedMessage?.trim() && selectedFiles.length === 0 && selectedImages.length === 0;
  // 첨부파일이 있는지 여부
  const hasAttachments = selectedFiles.length > 0 || selectedImages.length > 0;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedImages(fileArray);
      // 이미지 선택 시 첨부파일 옵션 닫기
      setIsAttachmentOptionsOpen(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles(fileArray);
      // 파일 선택 시 첨부파일 옵션 닫기
      setIsAttachmentOptionsOpen(false);
    }
  };

  const handleAlbumClick = () => {
    // 이미지 파일 선택 트리거
    imageInputRef.current?.click();
  };

  const handleFileClick = () => {
    // 파일 선택 트리거
    fileInputRef.current?.click();
  };

  const onSubmit = (data: MessageForm) => {
    // 메시지가 있으면 텍스트 메시지 전송
    if (data.message.trim()) {
      onSendMessage({
        message: data.message,
      });
      messageForm.reset();
    }

    // 선택된 이미지가 있으면 이미지 전송
    if (selectedImages.length > 0) {
      imageForm.setValue("images", selectedImages);
      imageForm.handleSubmit((imageData) => {
        onSendImages(imageData);
      })();
      setSelectedImages([]);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }

    // 선택된 파일이 있으면 파일 전송
    if (selectedFiles.length > 0) {
      fileForm.setValue("files", selectedFiles);
      fileForm.handleSubmit((fileData) => {
        onSendFiles(fileData);
      })();
      setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };
  return {
    imageInputRef,
    fileInputRef,
    handleImageChange,
    selectedImages,
    selectedFiles,
    setSelectedFiles,
    setSelectedImages,
    messageForm,
    onSubmit,
    isEmpty,
    hasAttachments,
    handleAlbumClick,
    handleFileClick,
    handleFileChange,
  };
};
export default useChatInputHandler;
