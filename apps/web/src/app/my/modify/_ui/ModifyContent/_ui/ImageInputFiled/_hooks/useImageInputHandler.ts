import { useEffect, useRef, useState, type ChangeEvent, type RefObject } from "react";
import { useController, useFormContext } from "react-hook-form";

import { convertUploadedImageUrl } from "@/utils/fileUtils";

interface ImageInputHandlerReturn {
  selectedImage: File | undefined;
  imagePreviewUrl: string | null;
  fileInputRef: RefObject<HTMLInputElement>;
  handleImageSelect: () => void;
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const useImageInputHandler = (initImagePreview: string | null): ImageInputHandlerReturn => {
  const { control } = useFormContext();

  const {
    field: { value: selectedImage, onChange: setFormValue },
  } = useController({
    name: "file",
    control,
  });

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initImagePreview) {
      setImagePreviewUrl(convertUploadedImageUrl(initImagePreview));
    }
  }, [initImagePreview]);

  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormValue(file); // useController로 폼 값 설정
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  return {
    selectedImage,
    imagePreviewUrl,
    fileInputRef,
    handleImageSelect,
    handleFileChange,
  };
};

export default useImageInputHandler;
