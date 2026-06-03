"use client";

import { Ban } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { postBlockUser } from "@/apis/users";
import { showIconToast } from "@/lib/toast/showIconToast";
import { customConfirm } from "@/lib/zustand/useConfirmModalStore";
import useReportedPostsStore from "@/lib/zustand/useReportedPostsStore";

type BlockCommunityUserOptions = {
  onBlocked?: () => void;
};

type BlockCommunityUserParams = {
  userId?: number;
  nickname?: string;
};

const IconBlock = Ban as ComponentType<SVGProps<SVGSVGElement>>;

const useBlockCommunityUser = ({ onBlocked }: BlockCommunityUserOptions = {}) => {
  const { mutateAsync: blockUser, isPending } = postBlockUser();
  const blockedUserIds = useReportedPostsStore((state) => state.blockedUserIds);
  const addBlockedUser = useReportedPostsStore((state) => state.addBlockedUser);

  const handleBlockUser = async ({ userId, nickname }: BlockCommunityUserParams) => {
    if (!userId) {
      return;
    }

    if (blockedUserIds.includes(userId)) {
      showIconToast("logo", "이미 차단한 사용자입니다.");
      onBlocked?.();
      return;
    }

    const userLabel = nickname ? `${nickname}님` : "이 사용자";
    const ok = await customConfirm({
      title: "사용자 차단",
      content: `${userLabel}의 게시글과 댓글이 보이지 않도록 차단할까요?`,
      approveMessage: "차단하기",
      rejectMessage: "취소",
      icon: IconBlock,
    });

    if (!ok) {
      return;
    }

    addBlockedUser(userId);
    onBlocked?.();

    try {
      await blockUser({
        blockedId: userId,
        data: {},
      });
      showIconToast("logo", "사용자를 차단했습니다.");
    } catch {
      showIconToast("logo", "차단 정보를 로컬에 저장했습니다.");
    }
  };

  return {
    handleBlockUser,
    isBlocking: isPending,
  };
};

export default useBlockCommunityUser;
