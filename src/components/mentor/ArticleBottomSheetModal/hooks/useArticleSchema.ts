import { useState } from "react";
import { useForm } from "react-hook-form";

import { ArticleFormData, articleSchema } from "../lib/schema";

import { zodResolver } from "@hookform/resolvers/zod";

interface UseArticleSchemaProps {
  initialData?: Partial<ArticleFormData>;
  onSubmit?: (data: ArticleFormData) => void;
  handleClose: () => void;
}

interface UseArticleSchemaReturn {
  methods: ReturnType<typeof useForm<ArticleFormData>>;
  imagePreview: string | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFormSubmit: (data: ArticleFormData) => void;
  handleModalClose: () => void;
  handleSetImageDelete: () => void;
}

const useArticleSchema = ({ initialData, onSubmit, handleClose }: UseArticleSchemaProps): UseArticleSchemaReturn => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
