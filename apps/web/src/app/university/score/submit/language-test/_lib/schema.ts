import { z } from "zod";
import { LanguageTestEnum } from "@/types/score";
import validateLanguageScore from "@/utils/scoreUtils";

// 1. Zod 스키마 정의: 폼 데이터의 유효성 규칙
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

export const languageTestSchema = z
  .object({
    testType: z.nativeEnum(LanguageTestEnum).refine((val) => !!val, {
      message: "어학 종류를 선택해주세요.",
    }),
    score: z.string().min(1, "점수를 입력해주세요."),
    file: z
      .instanceof(FileList)
      .refine((files) => files?.length === 1, "증명서 파일을 첨부해주세요.")
      .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `파일 크기는 5MB를 초과할 수 없습니다.`)
      .refine((files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type), ".jpeg, .png, .pdf 파일만 지원합니다."),
  })
  .refine(
    (data) => {
      // 2. 여러 필드에 걸친 복합 유효성 검사 (점수 범위)
      try {
        validateLanguageScore(data.testType, data.score);
        return true;
      } catch {
        return false;
      }
    },
    {
      message: "입력한 점수가 유효한 범위에 있는지 확인해주세요.",
      path: ["score"], // 오류가 발생할 필드를 지정
    },
  );

// Zod 스키마로부터 TypeScript 타입 추론
export type LanguageTestFormData = z.infer<typeof languageTestSchema>;
