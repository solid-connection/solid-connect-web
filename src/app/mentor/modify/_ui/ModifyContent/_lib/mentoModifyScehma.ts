import { z } from "zod";

export const mentoModifySchema = z.object({
  channels: z
    .array(
      z
        .object({
          type: z.string(),
          url: z.string(),
        })
        .refine(
          (data) => {
            // 둘 다 비어있거나, 둘 다 채워져 있어야 함
            const hasType = data.type.trim().length > 0;
            const hasUrl = data.url.trim().length > 0;
            return (hasType && hasUrl) || (!hasType && !hasUrl);
          },
          {
            message: "채널 타입과 URL은 함께 입력해주세요",
            path: ["type"], // 에러를 type 필드에 표시
          },
        )
        .refine(
          (data) => {
            // URL이 있다면 유효한 주소이어야 함
            if (data.url.trim().length > 0) {
              try {
                new URL(data.url);
                return true;
              } catch {
                return false;
              }
            }
            return true;
          },
          {
            message: "유효한 URL을 입력해주세요",
            path: ["url"],
          },
        ),
    )
    .optional(),
  introduction: z.string().max(200, "최대 200자까지 입력 가능합니다").optional(),
  passTip: z.string().max(200, "최대 200자까지 입력 가능합니다").optional(),
});

export type MentoModifyFormData = z.infer<typeof mentoModifySchema>;
