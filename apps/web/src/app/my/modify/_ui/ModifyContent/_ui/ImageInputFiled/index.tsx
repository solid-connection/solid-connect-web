import Image from "@/components/ui/FallbackImage";
import { IconAlbumWhite, IconSolidConnectionSmallLogo } from "@/public/svgs/my";
import useImageInputHandler from "./_hooks/useImageInputHandler";

interface ImageInputFiledProps {
  initImagePreview: string | null;
}

const ImageInputFiled = ({ initImagePreview }: ImageInputFiledProps) => {
  const { selectedImage, imagePreviewUrl, fileInputRef, handleImageSelect, handleFileChange } =
    useImageInputHandler(initImagePreview);

  return (
    <div className="flex flex-col items-center py-6">
      <div className="relative mb-4">
        <button
          type="button"
          className="flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gray-200"
          onClick={handleImageSelect}
        >
          {imagePreviewUrl ? (
            <Image
              unoptimized
              width={96}
              height={96}
              src={imagePreviewUrl}
              alt="Profile preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <IconSolidConnectionSmallLogo />
          )}
        </button>
        <button
          type="button"
          onClick={handleImageSelect}
          className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary"
        >
          <IconAlbumWhite />
        </button>
      </div>

      {/* 숨겨진 파일 input */}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

      <p className="text-primary typo-regular-2">
        {selectedImage ? "이미지가 선택되었습니다." : "이미지를 선택해주세요."}
      </p>
    </div>
  );
};
export default ImageInputFiled;
