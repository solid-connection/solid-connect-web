import { z } from "zod";

export const mentoModifySchema = z.object({
  channels: z
    .array(
      z
        .object({
          type: z.string(),
          link: z.string(),
        })
        .refine(
          (data) => {
            // 둘 다 비어있거나, 둘 다 채워져 있어야 함
            const hasType = data.type.trim().length > 0;
            const hasLink = data.link.trim().length > 0;
            return (hasType && hasLink) || (!hasType && !hasLink);
          },
          {
            message: "채널 타입과 링크는 함께 입력해주세요",
            path: ["type"], // 에러를 type 필드에 표시
          },
        )
        .refine(
          (data) => {
            // 링크가 있다면 유효한 URL이어야 함
            if (data.link.trim().length > 0) {
              try {
                new URL(data.link);
                return true;
              } catch {
                return false;
              }
            }
            return true;
          },
          {
            message: "유효한 URL을 입력해주세요",
            path: ["link"],
          },
        ),
    )
    .optional(),
  mentorMessage: z.string().max(200, "최대 200자까지 입력 가능합니다").optional(),
  successRecipe: z.string().max(200, "최대 200자까지 입력 가능합니다").optional(),
});

export type MentoModifyFormData = z.infer<typeof mentoModifySchema>;
