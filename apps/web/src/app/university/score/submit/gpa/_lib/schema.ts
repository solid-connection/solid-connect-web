import { z } from "zod";

// 1. Zod 스키마 정의: GPA 폼 데이터의 유효성 규칙
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf", "image/webp"];

export const gpaSchema = z
  .object({
    gpaCriteria: z.enum(["4.5", "4.3"]).refine((val) => val === "4.5" || val === "4.3", {
      message: "학점 기준을 선택해주세요.",
    }),
    gpa: z.string().min(1, "점수를 입력해주세요."),
    file: z
      .instanceof(FileList)
      .refine((files) => files?.length === 1, "증명서 파일을 첨부해주세요.")
      .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `파일 크기는 5MB를 초과할 수 없습니다.`)
      .refine((files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type), ".jpeg, .png, .webp, .pdf 파일만 지원합니다."),
  })
  .refine((data) => Number(data.gpa) <= Number(data.gpaCriteria), {
    message: "입력한 점수가 학점 기준을 초과할 수 없습니다.",
    path: ["gpa"], // 오류가 발생할 필드를 지정
  });

// Zod 스키마로부터 TypeScript 타입 추론
export type GpaFormData = z.infer<typeof gpaSchema>;
