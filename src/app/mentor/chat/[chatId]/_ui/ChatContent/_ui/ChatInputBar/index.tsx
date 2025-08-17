import Image from "next/image";
import { useState } from "react";

import clsx from "clsx";

import { downloadLocalFile } from "@/utils/fileUtils";

import useFileHandler from "./_hooks/useFileHandler";
import useImageHandler from "./_hooks/useImageHandler";
import useMessageHandler from "./_hooks/useMessageHandler";

import { IconAlbum, IconDirectMessage, IconFile, IconPlusK200, IconXWhite } from "@/public/svgs/mentor";

interface ChatInputBarProps {
  onSendMessage: (data: { message: string }) => void;
  onSendImages: (data: { images: File[] }) => void;
  onSendFiles: (data: { files: File[] }) => void;
}

const ChatInputBar = ({ onSendMessage, onSendImages, onSendFiles }: ChatInputBarProps) => {
  const [isAttachmentOptionsOpen, setIsAttachmentOptionsOpen] = useState(false);

  const { messageForm, onSubmitMessage, isMessageEmpty } = useMessageHandler({ onSendMessage });
  const {
    imageInputRef,
    selectedImages,
    setSelectedImages,
    imageForm,
    onSubmitImages,
    hasImages,
    handleImageChange,
    handleAlbumClick,
  } = useImageHandler({ onSendImages, setIsAttachmentOptionsOpen });

  const {
    fileInputRef,
    selectedFiles,
    setSelectedFiles,
    fileForm,
    onSubmitFiles,
    hasFiles,
    handleFileChange,
    handleFileClick,
  } = useFileHandler({ onSendFiles, setIsAttachmentOptionsOpen });

  const hasAttachments = hasImages || hasFiles;

  // 통합 전송 함수 - DirectMessage 버튼 클릭 시 호출
  const handleSend = () => {
    if (hasImages) {
      imageForm.setValue("images", selectedImages);
      imageForm.handleSubmit(onSubmitImages)();
    } else if (hasFiles) {
      fileForm.setValue("files", selectedFiles);
      fileForm.handleSubmit(onSubmitFiles)();
    } else if (!isMessageEmpty) {
      messageForm.handleSubmit(onSubmitMessage)();
    }
  };

  return (
    <div
      className={`flex-shrink-0 transition-all duration-300 ${isAttachmentOptionsOpen ? "bg-primary-100 pb-28" : "pb-0"}`}
    >
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

      <div className="relative w-full bg-k-0 shadow-top">
        {/* 선택된 파일들 미리보기 */}
        {(selectedImages.length > 0 || selectedFiles.length > 0) && (
          <div className="flex flex-wrap gap-2 border-b border-gray-200 p-4">
            {selectedImages.map((file, index) => (
              <div key={`image-${index}`} className="relative">
                <button
                  type="button"
                  onClick={() => downloadLocalFile(file)}
                  className="h-16 w-16 overflow-hidden rounded-lg border transition-opacity hover:opacity-80"
                >
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedImages((prev) => prev.filter((_, i) => i !== index))}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
            {selectedFiles.map((file, index) => (
              <div key={`file-${index}`} className="relative">
                <button
                  type="button"
                  onClick={() => downloadLocalFile(file)}
                  className="flex h-16 w-16 items-center justify-center rounded-lg bg-blue-200 transition-colors"
                >
                  <span className="text-xs text-blue-600">📁 {file.name.slice(0, 8)}...</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFiles((prev) => prev.filter((_, i) => i !== index))}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 메시지 폼 */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className={clsx(
            "flex items-center gap-2 p-4",
            isMessageEmpty && !isAttachmentOptionsOpen ? "bg-white" : "bg-primary-100",
          )}
        >
          {/* + 버튼을 좌측에 배치 */}
          <button
            type="button"
            onClick={() => setIsAttachmentOptionsOpen((prev) => !prev)}
            disabled={hasAttachments}
            className={clsx(
              "h-7 w-7 rounded-full p-1 transition-colors",
              hasAttachments ? "cursor-not-allowed bg-k-100" : isAttachmentOptionsOpen ? "bg-primary-200" : "bg-k-50",
            )}
          >
            <span className="h-4 w-4">
              {isAttachmentOptionsOpen ? (
                // X 아이콘 (임시로 텍스트 사용)
                <div className="flex h-full w-full items-center justify-center text-xs font-bold text-k-600">
                  <IconXWhite />
                </div>
              ) : (
                <IconPlusK200 />
              )}
            </span>
          </button>

          {/* Input 영역 */}
          <div
            className={clsx(
              "transition-al flex h-10 flex-1 justify-between rounded-3xl",
              hasAttachments
                ? "bg-k-50"
                : isMessageEmpty && !isAttachmentOptionsOpen
                  ? "border-transparent bg-k-50"
                  : "bg-white",
            )}
          >
            <input
              type="text"
              disabled={hasAttachments}
              className={clsx(
                "flex-1 rounded-2xl py-2 pl-3 pr-2 text-[14px] text-k-800 outline-none transition-colors placeholder:text-k-500",
                hasAttachments
                  ? "cursor-not-allowed bg-k-50 text-k-400"
                  : isMessageEmpty && !isAttachmentOptionsOpen
                    ? "bg-k-50"
                    : "bg-white",
              )}
              {...messageForm.register("message")}
              placeholder={
                hasAttachments
                  ? `${hasImages ? "이미지" : "파일"}를 보내시려면 전송 버튼을 클릭하세요.`
                  : "메시지를 입력하세요..."
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button
              type="submit"
              disabled={isMessageEmpty && !hasAttachments}
              className={clsx(
                "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                isMessageEmpty && !hasAttachments ? "bg-k-100" : "bg-primary",
              )}
            >
              <IconDirectMessage />
            </button>
          </div>
        </form>
      </div>

      {/* 첨부파일 옵션 - 카카오톡 스타일 */}
      {isAttachmentOptionsOpen && !hasAttachments && (
        <div className="flex w-full">
          <div className="ml-12 flex gap-3 p-4">
            {/* 앨범 버튼 */}
            <button
              data-option="album"
              onClick={handleAlbumClick}
              className="flex h-10 w-10 flex-col items-center justify-center rounded-lg transition-colors"
            >
              <div className="text-sm">
                <IconAlbum />
              </div>
              <span className="text-xs font-medium text-k-700">앨범</span>
            </button>

            {/* 파일 버튼 */}
            <button
              data-option="file"
              onClick={handleFileClick}
              className="flex h-10 w-10 flex-col items-center justify-center rounded-lg transition-colors"
            >
              <div className="text-sm">
                <IconFile />
              </div>
              <span className="text-xs font-medium text-k-700">파일</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInputBar;
