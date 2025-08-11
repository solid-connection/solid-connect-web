import { MentoModifyFormData } from "../_lib/mentoModifyScehma";

import usePutMyMentorProfile, { PutMyMentorProfileRequest } from "@/api/mentor/client/usePutMyMentorProfile";
import { customConfirm } from "@/lib/zustand/useConfirmModalStore";
import { IconModify } from "@/public/svgs/mentor";

interface UsePutMyMentorProfileHandlerReturn {
  onSubmit: (data: MentoModifyFormData) => Promise<void>;
}

const usePutMyMentorProfileHandler = (): UsePutMyMentorProfileHandlerReturn => {
  const { mutate: putMyMentorProfile } = usePutMyMentorProfile();

  // 폼 제출 핸들러
  const onSubmit = async (data: MentoModifyFormData) => {
    const ok = await customConfirm({
      title: "멘토 정보 수정",
      content: "멘토 정보를 수정하시겠습니까?",
      approveMessage: "수정하기",
      rejectMessage: "취소",
      icon: IconModify,
    });
    if (!ok) return;
    const payload: PutMyMentorProfileRequest = {
      channels: data.channels ?? [],
      introduction: data.introduction ?? "",
      passTip: data.passTip ?? "",
    };
    putMyMentorProfile(payload);
  };
  return { onSubmit };
};
export default usePutMyMentorProfileHandler;
