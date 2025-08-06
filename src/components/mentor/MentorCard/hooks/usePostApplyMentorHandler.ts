import { useRouter } from "next/router";

import usePostApplyMentoring from "@/api/mentee/client/usePostApplyMentoring";
import { customConfirm } from "@/lib/zustand/useConfirmModalStore";
import { IconCheck } from "@/public/svgs/mentor";

interface UsePostApplyMentorHandlerReturn {
  handlePostApplyMentor: (mentorId: number) => Promise<void>;
}
const usePostApplyMentorHandler = (): UsePostApplyMentorHandlerReturn => {
  const router = useRouter();

  const { mutate: postApplyMentoring } = usePostApplyMentoring();

  const handlePostApplyMentor = async (mentorId: number) => {
    postApplyMentoring(
      { mentorId },
      {
        onSuccess: async () => {
          const ok = await customConfirm({
            title: "멘티 신청이 완료되었어요!",
            content: "멘토가 신청을 수락하면 대화를 시작할 수 있어요.\n조금만 기다려주세요.",
            icon: IconCheck as string,
            approveMessage: "다른 멘토 찾기",
            rejectMessage: "홈으로",
          });
          if (ok) {
            router.push("/mentor");
          } else {
            router.push("/");
          }
        },
      },
    );
  };
  return { handlePostApplyMentor };
};
export default usePostApplyMentorHandler;
