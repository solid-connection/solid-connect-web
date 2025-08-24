import { useEffect, useRef, useState } from "react";
import { useController, useFormContext } from "react-hook-form";

interface ImageInputHandlerReturn {
  selectedImage: File | undefined;
  imagePreviewUrl: string | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleImageSelect: () => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface ImageInputHandlerReturn {
  selectedImage: File | undefined;
  imagePreviewUrl: string | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleImageSelect: () => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const NEXT_PUBLIC_UPLOADED_IMAGE_URL = process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL;

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
      setImagePreviewUrl(`${NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${initImagePreview}`);
    }
  }, [initImagePreview]);

  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
