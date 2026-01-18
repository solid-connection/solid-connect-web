import { z } from "zod";

export const mentoModifySchema = z.object({
  channels: z
    .array(
      z
        .object({
          type: z.string().nullable(),
          url: z.string(),
        })
        .refine(
          (data) => {
            // type이 null, undefined, 빈 문자열이면 채널 선택 안함으로 간주
            const hasType = data.type && data.type.trim().length > 0;
            const hasUrl = data.url && data.url.trim().length > 0;

            // 채널을 선택하지 않은 경우: 항상 통과
            if (!hasType) {
              return true;
            }

            // 채널을 선택한 경우: URL도 반드시 있어야 함
            return hasUrl;
          },
          {
            message: "채널을 선택했다면 URL을 입력해주세요",
            path: ["url"], // 에러를 url 필드에 표시
          },
        )
        .refine(
          (data) => {
            // URL이 입력되었다면 유효한 주소이어야 함
            if (data.url && data.url.trim().length > 0) {
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
