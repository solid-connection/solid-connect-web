"use client";

import { type ChangeEvent, type DragEvent, useEffect, useRef, useState } from "react";
import { COMMUNITY_MAX_UPLOAD_IMAGES } from "@/constants/community";
import { toast } from "@/lib/zustand/useToastStore";

type UseCommunityImageUploadOptions = {
  maxImages?: number;
};

const useCommunityImageUpload = ({ maxImages = COMMUNITY_MAX_UPLOAD_IMAGES }: UseCommunityImageUploadOptions = {}) => {
  const imageUploadRef = useRef<HTMLInputElement>(null);
  const dragDepthRef = useRef<number>(0);
  const selectedImageCountRef = useRef<number>(0);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [isDraggingImage, setIsDraggingImage] = useState<boolean>(false);

  useEffect(() => {
    selectedImageCountRef.current = selectedImages.length;
    const objectUrls = selectedImages.map((image) => URL.createObjectURL(image));
    setImagePreviewUrls(objectUrls);

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedImages]);

  const appendImageFiles = (files: File[]) => {
    if (files.length === 0) return;

    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length !== files.length) {
      toast.error("이미지 파일만 업로드할 수 있습니다.");
    }

    if (imageFiles.length === 0) return;

    const remainingSlots = maxImages - selectedImageCountRef.current;
    if (remainingSlots <= 0) {
      toast.error(`이미지는 최대 ${maxImages}장까지 업로드할 수 있습니다.`);
      return;
    }

    if (imageFiles.length > remainingSlots) {
      toast.error(`이미지는 최대 ${maxImages}장까지 업로드할 수 있습니다.`);
    }

    setSelectedImages((prev) => {
      const currentRemainingSlots = Math.max(0, maxImages - prev.length);
      const nextImages = [...prev, ...imageFiles.slice(0, currentRemainingSlots)];
      selectedImageCountRef.current = nextImages.length;
      return nextImages;
    });
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    appendImageFiles(files);
    event.target.value = "";
  };

  const handleImageDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    dragDepthRef.current += 1;
    setIsDraggingImage(true);
  };

  const handleImageDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "copy";
  };

  const handleImageDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    dragDepthRef.current -= 1;
    if (dragDepthRef.current <= 0) {
      dragDepthRef.current = 0;
      setIsDraggingImage(false);
    }
  };

  const handleImageDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    dragDepthRef.current = 0;
    setIsDraggingImage(false);

    const files = Array.from(event.dataTransfer.files ?? []);
    appendImageFiles(files);
  };

  const removeSelectedImage = (index: number) => {
    setSelectedImages((prev) => {
      const nextImages = prev.filter((_, imageIndex) => imageIndex !== index);
      selectedImageCountRef.current = nextImages.length;
      return nextImages;
    });
  };

  const openImagePicker = () => {
    imageUploadRef.current?.click();
  };

  return {
    maxImages,
    imageUploadRef,
    selectedImages,
    imagePreviewUrls,
    isDraggingImage,
    handleImageChange,
    handleImageDragEnter,
    handleImageDragOver,
    handleImageDragLeave,
    handleImageDrop,
    removeSelectedImage,
    openImagePicker,
  };
};

export default useCommunityImageUpload;
