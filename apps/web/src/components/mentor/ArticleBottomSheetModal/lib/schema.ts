import { z } from "zod";

// Zod 스키마 정의
export const articleSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요").max(20, "제목은 20자 이하로 입력해주세요"),
  description: z.string().min(1, "내용을 입력해주세요").max(300, "내용은 300자 이하로 입력해주세요"),
  url: z.union([z.string().url("올바른 링크 주소를 입력해주세요"), z.literal("")]).optional(),
  resetToDefaultImage: z.boolean().optional(),
  // file은 optional로 설정 (업로드하지 않을 수도 있으므로)
  file: z.instanceof(File).optional(),
});

export type ArticleFormData = z.infer<typeof articleSchema>;
