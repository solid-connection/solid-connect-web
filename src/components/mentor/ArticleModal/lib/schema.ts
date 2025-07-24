import { z } from "zod";

// Zod 스키마 정의
export const articleSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요").max(20, "제목은 20자 이하로 입력해주세요"),
  content: z.string().min(1, "내용을 입력해주세요").max(300, "내용은 300자 이하로 입력해주세요"),
  link: z.string().url("올바른 링크 주소를 입력해주세요").optional().or(z.literal("")),
  image: z.instanceof(File).optional(),
});

export type ArticleFormData = z.infer<typeof articleSchema>;
