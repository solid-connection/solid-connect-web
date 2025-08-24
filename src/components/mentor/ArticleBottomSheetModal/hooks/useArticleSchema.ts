import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { InitialData } from "..";
import { ArticleFormData, articleSchema } from "../lib/schema";

import usePostAddArticle from "@/api/news/client/usePostAddArticle";
import usePutModifyArticle from "@/api/news/client/usePutModifyArticle";
import { zodResolver } from "@hookform/resolvers/zod";

interface UseArticleSchemaProps {
  initialData?: InitialData;
  handleClose: () => void;
  isEdit: boolean;
}

interface UseArticleSchemaReturn {
  methods: ReturnType<typeof useForm<ArticleFormData>>;
  imagePreview: string | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFormSubmit: (data: ArticleFormData) => void;
  handleModalClose: () => void;
  handleSetImageDelete: () => void;
}

const useArticleSchema = ({ initialData, isEdit, handleClose }: UseArticleSchemaProps): UseArticleSchemaReturn => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { mutate: postAddArticle } = usePostAddArticle();
  const { mutate: putModifyArticle } = usePutModifyArticle();

  const methods = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      url: initialData?.url || "",
      file: undefined,
    },
  });

  useEffect(() => {
    setImagePreview(`${initialData?.thumbnailUrl}` || null);
  }, [initialData]);

  const { reset, setValue } = methods;

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
    console.log("Form submitted with data:", data);
    if (isEdit) {
      putModifyArticle(data);
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
