import Image from "next/image";
import { useState } from "react";

import clsx from "clsx";

import useChatInputHandler from "./_hooks/useChatInputHandler";
import useFileHandler from "./_hooks/useFileHandler";
import useImageHandler from "./_hooks/useImageHandler";
import useMessageHandler from "./_hooks/useMessageHandler";

import { IconDirectMessage, IconPlusK200, IconXWhite } from "@/public/svgs/mentor";

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
                <div className="h-16 w-16 overflow-hidden rounded-lg border">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
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

            {/* 첨부파일 전송 버튼 */}
            <div className="ml-2 flex items-center">
              {hasImages && (
                <button
                  type="button"
                  onClick={() => {
                    imageForm.setValue("images", selectedImages);
                    imageForm.handleSubmit(onSubmitImages)();
                  }}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-600"
                >
                  이미지 전송
                </button>
              )}
              {hasFiles && (
                <button
                  type="button"
                  onClick={() => {
                    fileForm.setValue("files", selectedFiles);
                    fileForm.handleSubmit(onSubmitFiles)();
                  }}
                  className="ml-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-600"
                >
                  파일 전송
                </button>
              )}
            </div>
          </div>
        )}

        {/* 메시지 폼 */}
        <form
          onSubmit={messageForm.handleSubmit(onSubmitMessage)}
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
              placeholder={hasAttachments ? "파일을 보내시려면 버튼을 클릭하세요." : "메시지를 입력하세요..."}
              onKeyDown={(e) => {
                if (hasAttachments) return;
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  messageForm.handleSubmit(onSubmitMessage)();
                }
              }}
            />
            <button
              type="submit"
              disabled={isMessageEmpty}
              onClick={() => {
                console.log("메시지 전송 버튼 클릭됨");
                console.log("isMessageEmpty:", isMessageEmpty);
              }}
              className={clsx(
                "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                isMessageEmpty ? "bg-k-100" : "bg-primary",
              )}
            >
              <IconDirectMessage />
            </button>
          </div>
        </form>
      </div>

      {/* 첨부파일 옵션 - 카카오톡 스타일 */}
      {isAttachmentOptionsOpen && !hasAttachments && (
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

      {/* 이미지 프리뷰 */}
      {hasImages && (
        <div className="mt-3 space-y-2">
          <div className="grid grid-cols-4 gap-2">
            {selectedImages.map((image, index) => (
              <div key={index} className="relative">
                <Image
                  src={URL.createObjectURL(image)}
                  alt={`preview-${index}`}
                  width={80}
                  height={80}
                  className="h-20 w-20 rounded-lg object-cover"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => {
                    const newImages = selectedImages.filter((_, i) => i !== index);
                    setSelectedImages(newImages);
                  }}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                console.log("이미지 전송 버튼 클릭됨");
                imageForm.setValue("images", selectedImages);
                imageForm.handleSubmit(onSubmitImages)();
              }}
              className="flex items-center justify-center rounded-lg bg-[#6366f1] px-3 py-1.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#5855eb]"
            >
              전송
            </button>
          </div>
        </div>
      )}

      {/* 파일 프리뷰 */}
      {hasFiles && (
        <div className="mt-3 space-y-2">
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg bg-gray-100 p-2">
                <div className="flex items-center space-x-2">
                  <div className="text-lg">📄</div>
                  <div>
                    <div className="text-sm font-medium">{file.name}</div>
                    <div className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(1)} MB</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newFiles = selectedFiles.filter((_, i) => i !== index);
                    setSelectedFiles(newFiles);
                  }}
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                console.log("파일 전송 버튼 클릭됨");
                fileForm.setValue("files", selectedFiles);
                fileForm.handleSubmit(onSubmitFiles)();
              }}
              className="flex items-center justify-center rounded-lg bg-[#6366f1] px-3 py-1.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#5855eb]"
            >
              전송
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInputBar;
