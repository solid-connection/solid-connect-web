import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { MentoModifyFormData, mentoModifySchema } from "../_lib/mentoModifyScehma";

import { MentorCardPreview } from "@/types/mentor";

import { zodResolver } from "@hookform/resolvers/zod";

type UseModifyHookFormReturn = ReturnType<typeof useForm<MentoModifyFormData>>;

const useModifyHookForm = (myMentorProfile: MentorCardPreview | null): UseModifyHookFormReturn => {
  const method = useForm<MentoModifyFormData>({
    resolver: zodResolver(mentoModifySchema),
  });
  const { reset } = method;

  useEffect(() => {
    if (myMentorProfile) {
      reset({
        channels: myMentorProfile.channels.map((channel) => ({
          type: channel.type,
          url: channel.url,
        })),
        introduction: myMentorProfile.introduction,
        passTip: "",
      });
    }
  }, [myMentorProfile, reset]);
  return { ...method };
};
export default useModifyHookForm;
