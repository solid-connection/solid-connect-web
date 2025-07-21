import Image from "next/image";

import BottomSheet from "@/components/ui/BottomSheet";

import useArticleSchema from "./hooks/useArticleSchema";
import { ArticleFormData } from "./lib/schema";

interface ArticleModalProps {
  isOpen: boolean;
  handleClose: () => void;
  onSubmit?: (data: ArticleFormData) => void;
  initialData?: Partial<ArticleFormData>;
}

const ArticleModal = ({ isOpen, handleClose, onSubmit, initialData }: ArticleModalProps) => {
  const { methods, imagePreview, handleImageChange, handleFormSubmit, handleModalClose, handleSetImageDelete } =
    useArticleSchema({
      initialData,
      onSubmit,
      handleClose,
    });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  if (!isOpen) return null;

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleModalClose}
      titleChild={
        <div className="relative flex h-10 w-full items-center">
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-semibold">
            아티클 추가하기
          </span>
          <button
            type="button"
            className="absolute right-0 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1 text-sm font-semibold text-secondary"
            onClick={() => {
              /* TODO: Add your button logic here */
            }}
          >
            저장
          </button>
        </div>
      }
      snap={[0.3, 0.6]} // 30%, 60% 높이에서 스냅
    >
      <div className="flex h-full flex-col">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex h-full flex-col overflow-hidden">
          <div className="scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 flex-1 space-y-6 overflow-y-auto px-2">
            {/* 제목 */}
            <div>
              <input
                type="text"
                {...register("title")}
                placeholder="제목을 입력해주세요. (최대 20자)"
                maxLength={20}
                className="w-full border-b border-k-100 py-4 text-gray-900 placeholder-k-100 focus:border-secondary-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>}
            </div>

            {/* 내용 */}
            <div>
              <textarea
                {...register("content")}
                placeholder="아티클의 내용을 간단히 남겨주세요."
                maxLength={300}
                rows={6}
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              {errors.content && <p className="mt-2 text-sm text-red-600">{errors.content.message}</p>}
            </div>

            {/* 아티클 링크 */}
            <div>
              <label className="mb-3 block text-base font-semibold text-blue-600">아티클 링크</label>
              <input
                type="url"
                {...register("link")}
                placeholder="링크주소"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              {errors.link && <p className="mt-2 text-sm text-red-600">{errors.link.message}</p>}
            </div>

            {/* 썸네일 등록 */}
            <div>
              <label className="mb-3 block text-base font-semibold text-blue-600">썸네일 등록</label>
              <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
                {imagePreview ? (
                  <div className="relative">
                    <Image
                      src={imagePreview}
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
                  <>
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
                      <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="mb-4 text-sm text-gray-500">아티클 썸네일을 등록해주세요</p>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="image-upload" />
                <label
                  htmlFor="image-upload"
                  className="inline-flex cursor-pointer items-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 shadow-sm transition-colors hover:border-gray-400 hover:bg-gray-50"
                >
                  파일 선택
                </label>
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex-shrink-0 border-t border-gray-100 bg-white pb-4 pt-6">
            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 py-4 text-lg font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </BottomSheet>
  );
};

export default ArticleModal;
