import { type PutMyMentorProfileRequest, usePutMyMentorProfile } from "@/apis/mentor";
import { customConfirm } from "@/lib/zustand/useConfirmModalStore";
import { IconModify } from "@/public/svgs/mentor";
import type { MentoModifyFormData } from "../_lib/mentoModifyScehma";

interface UsePutMyMentorProfileHandlerReturn {
  onSubmit: (data: MentoModifyFormData) => Promise<void>;
}

const usePutMyMentorProfileHandler = (): UsePutMyMentorProfileHandlerReturn => {
  const { mutate: putMyMentorProfile } = usePutMyMentorProfile();

  // 폼 제출 핸들러
  const onSubmit = async (data: MentoModifyFormData) => {
    const ok = await customConfirm({
      title: "변경 사항을 저장 하시겠어요?",
      content: "멘토 정보를 수정하시겠습니까?",
      approveMessage: "저장할게요",
      rejectMessage: "아니요",
      icon: IconModify,
    });
    if (!ok) return;

    // 채널 데이터 필터링: type이 있고 url이 있는 것만 포함
    const filteredChannels = (data.channels ?? [])
      .filter((channel) => {
        const hasType = channel.type && channel.type.trim().length > 0;
        const hasUrl = channel.url && channel.url.trim().length > 0;
        return hasType && hasUrl;
      })
      .map((channel) => ({
        type: channel.type as string, // null이 아님을 보장
        url: channel.url,
      }));

    const payload: PutMyMentorProfileRequest = {
      channels: filteredChannels,
      introduction: data.introduction ?? "",
      passTip: data.passTip ?? "",
    };
    putMyMentorProfile(payload);
  };
  return { onSubmit };
};
export default usePutMyMentorProfileHandler;
