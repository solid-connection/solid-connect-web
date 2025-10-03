import { z } from "zod";

export const mentorApplicationSchema = z.object({
  // Step 1: 관심 국가
  interestedCountries: z.array(z.string()).min(1, "관심 국가를 하나 이상 선택해주세요."),

  // Step 2: 수학 학교
  country: z.string().min(1, "국가를 선택해주세요."),
  universityName: z.string().min(1, "학교를 선택해주세요."),
  verificationFile: z
    .instanceof(File)
    .nullable()
    .refine((file) => file !== null, {
      message: "증명 서류(파일)를 업로드해 주세요.",
    }),

  // Step 3: 준비 단계
  studyStatus: z.enum(["PLANNING", "STUDYING", "COMPLETED"], {
    required_error: "준비 단계를 선택해주세요.",
  }),
});

export type MentorApplicationFormData = z.infer<typeof mentorApplicationSchema>;

// 단계별 부분 스키마
export const step1Schema = mentorApplicationSchema.pick({
  interestedCountries: true,
});

export const step2Schema = mentorApplicationSchema.pick({
  country: true,
  universityName: true,
  verificationFile: true,
});

export const step3Schema = mentorApplicationSchema.pick({
  studyStatus: true,
});

export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type Step3FormData = z.infer<typeof step3Schema>;
