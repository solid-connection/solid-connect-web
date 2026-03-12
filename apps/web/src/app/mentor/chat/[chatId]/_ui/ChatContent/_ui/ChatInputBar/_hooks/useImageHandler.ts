import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Zod 스키마 정의
const imageSchema = z.object({
  images: z.array(z.instanceof(File)).min(1, "이미지를 선택해주세요"),
});

// 타입 정의
type ImageForm = z.infer<typeof imageSchema>;

type UseImageHandlerProps = {
  onSendImages: (data: { images: File[] }) => void;
  setIsAttachmentOptionsOpen: (isOpen: boolean) => void;
};

const useImageHandler = ({ onSendImages, setIsAttachmentOptionsOpen }: UseImageHandlerProps) => {
  // 이미지용 폼
  const imageForm = useForm<ImageForm>({
    resolver: zodResolver(imageSchema),
  });

  // state
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  // ref
  const imageInputRef = useRef<HTMLInputElement>(null);

  // 이미지가 있는지 여부
  const hasImages = selectedImages.length > 0;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedImages(fileArray);
      // 이미지 선택 시 첨부파일 옵션 닫기
      setIsAttachmentOptionsOpen(false);
    }
  };

  const handleAlbumClick = () => {
    // 이미지 파일 선택 트리거
    imageInputRef.current?.click();
  };

  const onSubmitImages = (data: ImageForm) => {
    onSendImages(data);
    setSelectedImages([]);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  return {
    imageInputRef,
    selectedImages,
    setSelectedImages,
    imageForm,
    onSubmitImages,
    hasImages,
    handleImageChange,
    handleAlbumClick,
  };
};

export default useImageHandler;
