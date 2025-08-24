import Image from "next/image";

import BottomSheet from "@/components/ui/BottomSheet";

import useArticleSchema from "./hooks/useArticleSchema";

import { IconCamera } from "@/public/svgs/mentor";

export type InitialData = {
  title?: string;
  description?: string;
  url?: string;
  thumbnailUrl?: string;
};

type ArticleBottomSheetModalProps = {
  mode: "수정하기" | "추가하기";
  isOpen: boolean;
  handleClose: () => void;
  initialData?: InitialData;
};

const NEXT_PUBLIC_IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

const ArticleBottomSheetModal = ({ isOpen, mode, handleClose, initialData }: ArticleBottomSheetModalProps) => {
  const { methods, imagePreview, handleImageChange, handleFormSubmit, handleModalClose, handleSetImageDelete } =
    useArticleSchema({
      initialData,
      isEdit: mode === "수정하기",
      handleClose,
    });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const imagePreviewSrc = initialData?.thumbnailUrl
    ? `${NEXT_PUBLIC_IMAGE_URL}/${initialData.thumbnailUrl}`
    : imagePreview;

  if (!isOpen) return null;

  return (
    <form className="flex h-full flex-col overflow-hidden">
      <BottomSheet
        isOpen={isOpen}
        onClose={handleModalClose}
        titleChild={
          <div className="relative flex h-10 w-full items-center">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-semibold">
              아티클 {mode}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(handleFormSubmit)(e);
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1 text-sm font-semibold text-secondary"
            >
              저장
            </button>
          </div>
        }
      >
        <div className="flex h-full flex-col">
          <div className="scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 flex-1 space-y-6 overflow-y-auto px-2">
            {/* 제목 */}
            <div>
              <input
                type="text"
                {...register("title")}
                placeholder="제목을 입력해주세요. (최대 20자)"
                maxLength={20}
                className="w-full border-b border-k-100 py-4 text-k-900 placeholder-k-100 focus:border-b focus:border-secondary-200 focus:outline-none"
              />
              {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>}
            </div>

            {/* 내용 */}
            <div>
              <textarea
                {...register("description")}
                placeholder="아티클의 내용을 간단히 남겨주세요."
                maxLength={300}
                rows={6}
                className="w-full border-b border-k-100 py-4 text-k-900 placeholder-k-100 focus:border-b focus:border-secondary-200 focus:outline-none"
              />
              {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>}
            </div>

            {/* 아티클 링크 */}
            <div>
              <label className="mb-3 block text-lg font-normal text-primary">아티클 링크</label>
              <input
                type="url"
                {...register("url")}
                placeholder="링크주소"
                className="w-full rounded-xl bg-k-50 p-4 text-sm placeholder-k-500 focus:border-secondary-200 focus:outline-none focus:ring-secondary-100"
              />
              {errors.url && <p className="mt-2 text-sm text-red-600">{errors.url.message}</p>}
            </div>

            {/* 썸네일 등록 */}
            <div>
              <label className="mb-3 block text-lg font-normal text-primary">썸네일 등록</label>
              <div className="rounded-xl bg-k-50 p-12 text-center">
                {imagePreviewSrc ? (
                  <div className="relative">
                    <Image
                      src={imagePreviewSrc}
                      alt="미리보기"
                      width={200}
                      height={120}
                      className="mx-auto rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleSetImageDelete}
                      className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow-lg"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label htmlFor="image-upload" className="flex cursor-pointer flex-col items-center">
                    <div className="mx-auto mb-4 flex h-6 w-6 items-center justify-center rounded-full">
                      <IconCamera />
                    </div>
                    <p className="mb-4 text-sm text-k-500">아티클 썸네일을 등록해주세요</p>
                  </label>
                )}
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="image-upload" />
              </div>
            </div>
          </div>
        </div>
      </BottomSheet>
    </form>
  );
};

export default ArticleBottomSheetModal;
