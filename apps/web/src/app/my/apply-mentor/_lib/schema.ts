import { z } from "zod";
import { CountryCode } from "@/types/university";

const countryCodeValues = Object.values(CountryCode) as [CountryCode, ...CountryCode[]];

const verificationFileSchema = z
  .union([z.instanceof(File), z.null(), z.undefined()])
  .refine((file) => file !== null && file !== undefined, {
    message: "증명 서류(파일)를 업로드해 주세요.",
  })
  .refine(
    (file) => {
      if (!file) return false;
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
      return allowedTypes.includes(file.type);
    },
    {
      message: "파일 형식은 png, jpg, pdf만 허용됩니다.",
    },
  )
  .transform((file) => file!);

export const mentorApplicationSchema = z.object({
  // Step 1: 멘토 신청 가능 상태
  preparationStatus: z.enum(["AFTER_EXCHANGE"], {
    message: "수학 완료 상태만 멘토 전환을 신청할 수 있습니다.",
  }),

  // Step 2: 수학 국가
  country: z.enum(countryCodeValues, {
    message: "국가를 선택해주세요.",
  }),

  // Step 3: 수학 학교 및 증명서
  universityId: z.number().int().positive("학교를 선택해주세요."),
  term: z.string().min(1, "파견 학기 정보를 확인할 수 없습니다."),
  verificationFile: verificationFileSchema,
});

export type MentorApplicationFormInputData = z.input<typeof mentorApplicationSchema>;
export type MentorApplicationFormData = z.output<typeof mentorApplicationSchema>;

// 단계별 부분 스키마
export const step1Schema = mentorApplicationSchema.pick({
  preparationStatus: true,
});

export const step2Schema = mentorApplicationSchema.pick({
  country: true,
});

export const step3Schema = mentorApplicationSchema.pick({
  universityId: true,
  term: true,
  verificationFile: true,
});

export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type Step3FormData = z.infer<typeof step3Schema>;
