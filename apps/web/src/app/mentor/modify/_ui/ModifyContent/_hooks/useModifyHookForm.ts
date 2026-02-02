import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import type { MentorCardPreview } from "@/types/mentor";
import { type MentoModifyFormData, mentoModifySchema } from "../_lib/mentoModifyScehma";

type UseModifyHookFormReturn = ReturnType<typeof useForm<MentoModifyFormData>>;

const useModifyHookForm = (myMentorProfile: MentorCardPreview | null): UseModifyHookFormReturn => {
  const method = useForm<MentoModifyFormData>({
    resolver: zodResolver(mentoModifySchema),
  });
  const { reset } = method;

  useEffect(() => {
    if (myMentorProfile) {
      // 4개의 채널 슬롯을 만들고 기존 데이터로 채움
      const channels = Array.from({ length: 4 }, (_, index) => {
        const existingChannel = myMentorProfile.channels[index];
        return existingChannel ? { type: existingChannel.type, url: existingChannel.url } : { type: null, url: "" };
      });

      reset({
        channels,
        introduction: myMentorProfile.introduction,
        passTip: myMentorProfile.passTip ?? "",
      });
    } else {
      // myMentorProfile이 없을 때도 4개의 빈 채널 슬롯 제공
      reset({
        channels: Array.from({ length: 4 }, () => ({ type: null, url: "" })),
        introduction: "",
        passTip: "",
      });
    }
  }, [myMentorProfile, reset]);
  return method;
};
export default useModifyHookForm;
