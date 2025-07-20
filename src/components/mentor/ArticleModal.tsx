import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { z } from "zod";

import BottomSheet from "@/components/ui/BottomSheet";

import { zodResolver } from "@hookform/resolvers/zod";

// Zod 스키마 정의
const articleSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요").max(20, "제목은 20자 이하로 입력해주세요"),
  content: z.string().min(1, "내용을 입력해주세요").max(300, "내용은 300자 이하로 입력해주세요"),
  link: z.string().url("올바른 링크 주소를 입력해주세요").optional().or(z.literal("")),
  image: z.instanceof(File).optional(),
});

type ArticleFormData = z.infer<typeof articleSchema>;

interface ArticleModalProps {
  isOpen: boolean;
  handleClose: () => void;
  onSubmit?: (data: ArticleFormData) => void;
  initialData?: Partial<ArticleFormData>;
}

const ArticleModal = ({ isOpen, handleClose, onSubmit, initialData }: ArticleModalProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      link: initialData?.link || "",
      image: undefined,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setValue("image", file);

      // 미리보기 설정
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (data: ArticleFormData) => {
    if (onSubmit) {
      onSubmit(data);
    }
    handleClose();
    reset();
  };

  const handleModalClose = () => {
    handleClose();
    reset();
    setImagePreview(null);
  };

  if (!isOpen) return null;

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={handleModalClose}
      title="아티클 추가하기"
      snap={[0.3, 0.6]} // 30%, 60% 높이에서 스냅
    >
      <div className="flex h-full flex-col">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex h-full flex-col overflow-hidden">
          <div className="scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 flex-1 space-y-6 overflow-y-auto px-2">
            {/* 제목 */}
            <div>
              <label className="mb-3 block text-base font-semibold text-gray-900">제목</label>
              <input
                type="text"
                {...register("title")}
                placeholder="제목을 입력해주세요. (최대 20자)"
                maxLength={20}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>}
            </div>

            {/* 내용 */}
            <div>
              <label className="mb-3 block text-base font-semibold text-gray-900">
                아티클의 내용을 간단히 남겨주세요. (최대 300자)
              </label>
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
                      onClick={() => {
                        setImagePreview(null);
                        setValue("image", undefined);
                      }}
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
