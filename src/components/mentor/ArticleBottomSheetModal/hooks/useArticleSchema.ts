import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useGetMentorMyProfile } from "@/apis/mentor";
import { usePostAddArticle, usePutModifyArticle } from "@/apis/news";
import { convertUploadedImageUrl } from "@/utils/fileUtils";
import type { InitialData } from "..";
import { type ArticleFormData, articleSchema } from "../lib/schema";

interface UseArticleSchemaProps {
  initialData?: InitialData;
  handleClose: () => void;
  isEdit: boolean;
  articleId?: number;
  isOpen: boolean;
}

interface UseArticleSchemaReturn {
  methods: ReturnType<typeof useForm<ArticleFormData>>;
  imagePreview: string | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFormSubmit: (data: ArticleFormData) => void;
  handleModalClose: () => void;
  handleSetImageDelete: () => void;
}

const useArticleSchema = ({
  initialData,
  isEdit,
  articleId = -1,
  handleClose,
  isOpen,
}: UseArticleSchemaProps): UseArticleSchemaReturn => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: myInfo } = useGetMentorMyProfile(); // myInfo?.id 필요
  const { mutate: postAddArticle } = usePostAddArticle(myInfo?.id || null);
  const { mutate: putModifyArticle } = usePutModifyArticle(myInfo?.id || null);

  const methods = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      url: initialData?.url || "",
      file: undefined,
    },
  });

  const { reset, setValue } = methods;

  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때: initialData로 폼을 초기화합니다.
      const defaultValues = {
        title: initialData?.title || "",
        description: initialData?.description || "",
        url: initialData?.url || "",
        file: undefined,
      };
      reset(defaultValues); // react-hook-form의 reset 기능으로 defaultValues 설정

      // 이미지 미리보기도 초기 데이터로 설정합니다.
      const imageSrc = initialData?.thumbnailUrl ? convertUploadedImageUrl(initialData.thumbnailUrl) : null;
      setImagePreview(imageSrc);
    } else {
      // 모달이 닫힐 때: 모든 상태를 깨끗하게 초기화합니다.
      reset({ title: "", description: "", url: "", file: undefined });
      setImagePreview(null);
    }
  }, [isOpen, initialData, reset]); // isOpen 또는 initialData가 변경될 때마다 실행

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setValue("file", file);

      // 미리보기 설정
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (data: ArticleFormData) => {
    if (isEdit) {
      putModifyArticle({ body: data, articleId });
    } else {
      postAddArticle(data);
    }
    handleClose();
    reset();
  };

  const handleModalClose = () => {
    handleClose();
    reset();
    setImagePreview(null);
  };

  const handleSetImageDelete = () => {
    setImagePreview(null);
    setValue("file", undefined);
  };
  return {
    methods,
    imagePreview,
    handleImageChange,
    handleFormSubmit,
    handleModalClose,
    handleSetImageDelete,
  };
};

export default useArticleSchema;
