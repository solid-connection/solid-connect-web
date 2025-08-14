import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

import clsx from "clsx";

import { IconDirectMessage, IconPlus, IconPlusK200 } from "@/public/svgs/mentor";

interface MessageForm {
  message: string;
  files?: FileList;
  images?: FileList;
}

interface ChatInputBarProps {
  onSendMessage: (data: { message: string; files?: File[]; images?: File[] }) => void;
}

const ChatInputBar = ({ onSendMessage }: ChatInputBarProps) => {
  const { register, handleSubmit, reset, watch } = useForm<MessageForm>();
  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);

  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const watchedMessage = watch("message", "");
  const isEmpty = !watchedMessage?.trim() && selectedFiles.length === 0 && selectedImages.length === 0;

  const handleAttachmentClick = () => {
    const newShowState = !showAttachmentOptions;
    setShowAttachmentOptions(newShowState);

    // 상위 컴포넌트에 첨부파일 옵션 상태 전달
    setIsAttachmentOpen?.(newShowState);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSelectedImages(Array.from(files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSelectedFiles(Array.from(files));
    }
  };

  const handleAlbumClick = () => {
    // 이미지 파일 선택 트리거
    imageInputRef.current?.click();
    setShowAttachmentOptions(false);
  };

  const handleFileClick = () => {
    // 파일 선택 트리거
    fileInputRef.current?.click();
    setShowAttachmentOptions(false);
  };

  const onSubmit = (data: MessageForm) => {
    if (data.message.trim() || selectedFiles.length > 0 || selectedImages.length > 0) {
      onSendMessage({
        message: data.message,
        files: selectedFiles.length > 0 ? selectedFiles : undefined,
        images: selectedImages.length > 0 ? selectedImages : undefined,
      });
      // 폼 및 파일 상태 리셋
      reset();
      setSelectedFiles([]);
      setSelectedImages([]);

      // 파일 입력 요소도 리셋
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  return (
    <div className={`flex-shrink-0 transition-all duration-300 ${isAttachmentOpen ? "bg-primary-100 pb-28" : "pb-0"}`}>
      {/* 숨겨진 파일 입력 요소들 */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleImageChange}
      />
      <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileChange} />

      <div className="relative w-full border-b border-t border-k-50 bg-k-0 shadow-top">
        {/* 선택된 파일들 미리보기 */}
        {(selectedImages.length > 0 || selectedFiles.length > 0) && (
          <div className="flex flex-wrap gap-2 border-b border-gray-200 p-4">
            {selectedImages.map((file, index) => (
              <div key={`image-${index}`} className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-orange-100">
                  <span className="text-xs text-orange-600">🖼️ {file.name.slice(0, 8)}...</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedImages((prev) => prev.filter((_, i) => i !== index))}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                >
                  ✕
                </button>
              </div>
            ))}
            {selectedFiles.map((file, index) => (
              <div key={`file-${index}`} className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-blue-100">
                  <span className="text-xs text-blue-600">📁 {file.name.slice(0, 8)}...</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFiles((prev) => prev.filter((_, i) => i !== index))}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={clsx(
            "flex items-center gap-2 p-4",
            isEmpty && !showAttachmentOptions ? "bg-white" : "bg-primary-100",
          )}
        >
          {/* + 버튼을 좌측에 배치 */}
          <button
            type="button"
            onClick={handleAttachmentClick}
            className={clsx(
              "h-7 w-7 rounded-full p-1 transition-colors",
              isEmpty && !showAttachmentOptions ? "bg-k-50 hover:bg-k-100" : "bg-primary-200 hover:bg-primary-300",
            )}
          >
            <span className="h-4 w-4">
              {showAttachmentOptions ? (
                // X 아이콘 (임시로 텍스트 사용)
                <div className="flex h-full w-full items-center justify-center text-xs font-bold text-k-600">✕</div>
              ) : isEmpty ? (
                <IconPlusK200 />
              ) : (
                <IconPlus />
              )}
            </span>
          </button>

          {/* Input 영역 */}
          <div
            className={clsx(
              "transition-al flex h-10 flex-1 justify-between rounded-3xl",
              isEmpty && !showAttachmentOptions ? "border-transparent bg-k-50" : "bg-white",
            )}
          >
            <input
              type="text"
              className={clsx(
                "flex-1 rounded-2xl py-2 pl-3 pr-2 text-[14px] text-k-800 outline-none transition-colors placeholder:text-k-500",
                isEmpty && !showAttachmentOptions ? "bg-k-50" : "bg-white",
              )}
              {...register("message", {
                required: true,
              })}
              placeholder="메시지를 입력하세요..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(onSubmit)();
                }
              }}
            />
            <button
              type="submit"
              disabled={isEmpty}
              className={clsx(
                "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                isEmpty ? "bg-k-100" : "bg-primary",
              )}
            >
              <IconDirectMessage />
            </button>
          </div>
        </form>
      </div>

      {/* 첨부파일 옵션 - 카카오톡 스타일 */}
      {showAttachmentOptions && (
        <div className="w-full">
          <div className="flex gap-2 p-4">
            {/* 앨범 버튼 */}
            <button
              data-option="album"
              onClick={handleAlbumClick}
              className="flex h-10 w-10 flex-col items-center justify-center rounded-lg bg-white transition-colors hover:bg-gray-50"
            >
              <div className="text-sm">🖼️</div>
              <span className="text-[10px] font-medium text-k-700">앨범</span>
            </button>

            {/* 파일 버튼 */}
            <button
              data-option="file"
              onClick={handleFileClick}
              className="flex h-10 w-10 flex-col items-center justify-center rounded-lg bg-white transition-colors hover:bg-gray-50"
            >
              <div className="text-sm">📁</div>
              <span className="text-[10px] font-medium text-k-700">파일</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInputBar;
