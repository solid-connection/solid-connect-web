import BottomSheet from "@/components/ui/BottomSheet";
import Image from "@/components/ui/FallbackImage";
import { IconCamera } from "@/public/svgs/mentor";
import useArticleSchema from "./hooks/useArticleSchema";

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
  articleId?: number;
};

const ArticleBottomSheetModal = ({
  isOpen,
  mode,
  articleId,
  handleClose,
  initialData,
}: ArticleBottomSheetModalProps) => {
  const { methods, imagePreview, handleImageChange, handleFormSubmit, handleModalClose, handleSetImageDelete } =
    useArticleSchema({
      initialData,
      isEdit: mode === "수정하기",
      handleClose,
      articleId,
      isOpen,
    });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  if (!isOpen) return null;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <BottomSheet
        isOpen={isOpen}
        onClose={handleModalClose}
        titleChild={
          <div className="relative flex h-10 w-full items-center">
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 typo-sb-5">아티클 {mode}</span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(handleFormSubmit)(e);
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1 text-secondary typo-sb-9"
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
              {errors.title && <p className="mt-2 text-red-600 typo-regular-2">{errors.title.message}</p>}
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
              {errors.description && <p className="mt-2 text-red-600 typo-regular-2">{errors.description.message}</p>}
            </div>

            {/* 아티클 링크 */}
            <div>
              <label className="mb-3 block text-primary typo-regular-1">아티클 링크</label>
              <input
                type="url"
                {...register("url")}
                placeholder="링크주소"
                className="w-full rounded-xl bg-k-50 p-4 placeholder-k-500 typo-regular-2 focus:border-secondary-200 focus:outline-none focus:ring-secondary-100"
              />
              {errors.url && <p className="mt-2 text-red-600 typo-regular-2">{errors.url.message}</p>}
            </div>

            {/* 썸네일 등록 */}
            <div>
              <label className="mb-3 block text-primary typo-regular-1">썸네일 등록</label>
              <div className="rounded-xl bg-k-50 p-12 text-center">
                {imagePreview ? (
                  <div className="relative w-full">
                    <Image
                      src={imagePreview}
                      alt="미리보기"
                      width={400}
                      height={200}
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
                    <p className="mb-4 text-k-500 typo-regular-2">아티클 썸네일을 등록해주세요</p>
                  </label>
                )}
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="image-upload" />
              </div>
            </div>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};

export default ArticleBottomSheetModal;
