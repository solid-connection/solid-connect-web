"use client";

import { type ChangeEvent, type FormEvent, type KeyboardEvent, useEffect, useId, useRef, useState } from "react";
import { IconAlbum, IconDirectMessage } from "@/public/svgs/mentor";

interface ChatInputBarProps {
  disabled?: boolean;
  canSend?: boolean;
  onSendText: (content: string) => Promise<boolean>;
  onSendImages: (files: File[]) => Promise<boolean>;
}

interface SelectedImage {
  id: number;
  file: File;
}

const ImagePreview = ({ file }: { file: File }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(
    function createImagePreview() {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      return function releaseImagePreview() {
        URL.revokeObjectURL(objectUrl);
      };
    },
    [file],
  );

  return previewUrl ? (
    <img src={previewUrl} alt={file.name} className="h-16 w-16 rounded-lg object-cover" />
  ) : (
    <div className="h-16 w-16 rounded-lg bg-k-50" />
  );
};

const ChatInputBar = ({ disabled = false, canSend = true, onSendText, onSendImages }: ChatInputBarProps) => {
  const [message, setMessage] = useState("");
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const isSubmittingRef = useRef(false);
  const isComposingRef = useRef(false);
  const nextImageIdRef = useRef(0);
  const hintId = useId();
  const hasImages = selectedImages.length > 0;
  const isLocked = disabled || isSubmitting;

  const send = async () => {
    if (disabled || !canSend || isSubmittingRef.current || isComposingRef.current) return;

    const content = message.trim();
    if (!hasImages && !content) return;

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setError(null);

    try {
      const isAccepted = hasImages
        ? await onSendImages(selectedImages.map((image) => image.file))
        : await onSendText(content);

      if (isAccepted) {
        if (hasImages) {
          setSelectedImages([]);
        } else {
          setMessage("");
        }
      } else {
        setError("연결을 확인한 뒤 다시 보내주세요. 입력 내용은 유지했어요.");
      }
    } catch {
      setError("전송하지 못했어요. 입력 내용을 유지했으니 다시 시도해주세요.");
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void send();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey) return;
    if (event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229 || isComposingRef.current) return;

    event.preventDefault();
    void send();
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (disabled || isSubmittingRef.current || files.length === 0) return;

    const images = files.filter((file) => file.type.startsWith("image/"));
    setError(images.length === files.length ? null : "이미지만 보낼 수 있어요.");
    setSelectedImages((previous) => [...previous, ...images.map((file) => ({ id: nextImageIdRef.current++, file }))]);
  };

  return (
    <form
      aria-label="채팅 메시지 작성"
      aria-busy={isSubmitting}
      onSubmit={handleSubmit}
      className="shrink-0 border-t border-k-50 bg-k-0 pb-[env(safe-area-inset-bottom)] shadow-top"
    >
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        disabled={isLocked}
        aria-label="채팅 이미지 선택"
        className="hidden"
        onChange={handleImageChange}
      />

      {hasImages && (
        <div className="border-b border-k-50 px-4 py-3">
          <p className="mb-2 text-k-600 typo-regular-4">
            이미지 {selectedImages.length}장만 전송해요. 작성한 메시지는 유지돼요.
          </p>
          <ul aria-label="선택한 이미지" className="flex gap-3 overflow-x-auto py-1">
            {selectedImages.map(({ id, file }) => (
              <li key={id} className="relative shrink-0">
                <ImagePreview file={file} />
                <button
                  type="button"
                  aria-label={`${file.name} 제거`}
                  disabled={isLocked}
                  onClick={() => {
                    if (disabled || isSubmittingRef.current) return;
                    setSelectedImages((images) => images.filter((image) => image.id !== id));
                  }}
                  className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-k-900 text-white disabled:opacity-50"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-end gap-2 px-4 pt-3">
        <button
          type="button"
          aria-label="이미지 선택"
          disabled={isLocked}
          onClick={() => imageInputRef.current?.click()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-k-50 disabled:opacity-50"
        >
          <span aria-hidden="true">
            <IconAlbum />
          </span>
        </button>
        <textarea
          aria-label="메시지"
          aria-describedby={hintId}
          rows={1}
          value={message}
          disabled={isLocked || hasImages}
          onChange={(event) => {
            if (disabled || isSubmittingRef.current) return;
            setMessage(event.target.value);
            setError(null);
          }}
          onCompositionStart={() => {
            isComposingRef.current = true;
          }}
          onCompositionEnd={() => {
            isComposingRef.current = false;
          }}
          onKeyDown={handleKeyDown}
          placeholder={hasImages ? "선택한 이미지만 전송해요" : "메시지를 입력하세요..."}
          className="max-h-36 min-h-10 min-w-0 flex-1 resize-y rounded-2xl bg-k-50 px-3 py-2 text-k-800 typo-regular-2 disabled:opacity-60"
        />
        <button
          type="submit"
          aria-label={hasImages ? `이미지 ${selectedImages.length}장 보내기` : "메시지 보내기"}
          disabled={isLocked || !canSend || (!hasImages && !message.trim())}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white disabled:bg-k-100"
        >
          <span aria-hidden="true">
            <IconDirectMessage />
          </span>
        </button>
      </div>
      <p id={hintId} className="px-4 py-2 text-k-500 typo-regular-4">
        {isSubmitting
          ? "전송 중이에요."
          : !canSend
            ? "연결되면 메시지를 보낼 수 있어요. 작성한 내용은 유지돼요."
            : "이미지만 보낼 수 있어요. Shift+Enter로 줄을 바꿀 수 있어요."}
      </p>
      {error && (
        <p role="alert" className="px-4 pb-2 text-red-500 typo-regular-4">
          {error}
        </p>
      )}
    </form>
  );
};

export default ChatInputBar;
