"use client";

import MentorChatCard from "@/components/mentor/MentorChatCard/index";
import MentorExpandChatCard from "@/components/mentor/MentorExpandChatCard";
import EmptySdwBCards from "@/components/ui/EmptySdwBCards";

import MentorWaitingListBox from "./_ui/MentorWaitingListBox";

import { VerifyStatus } from "@/types/mentee";

import useGetApplyMentoringList from "@/api/mentee/client/useGetApplyMentoringList";

const DEFAULT_VISIBLE_ITEMS = 2;

const WaitingContent = () => {
  const { data: approveList = [] } = useGetApplyMentoringList(VerifyStatus.APPROVED);
  const { data: pendingList = [] } = useGetApplyMentoringList(VerifyStatus.PENDING);
  const totalLength = approveList.length + pendingList.length;

  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-3 mt-5 flex justify-between px-5">
        <div className="flex items-center">
          <h2 className="mr-2 typo-sb-5 text-k-900">대기 중인 멘토링</h2>
          {totalLength > DEFAULT_VISIBLE_ITEMS && (
            <span className="rounded-2xl bg-primary-1 px-2 text-k-0">{totalLength - 2}+</span>
          )}
        </div>
      </div>
      <MentorWaitingListBox hasExpand={approveList.length > DEFAULT_VISIBLE_ITEMS} className="mx-5 mt-2">
        {({ isExpanded }) => (
          <div className="space-y-2">
            <h3 className="mt-3 px-5 typo-sb-5 text-k-900">수락 완료</h3>
            <div className="space-y-2">
              {approveList.length === 0 ? (
                <div className="px-4 py-3">
                  <EmptySdwBCards message="신규 매칭된 멘토가 없어요." />
                </div>
              ) : (
                (isExpanded ? approveList : approveList.slice(0, DEFAULT_VISIBLE_ITEMS)).map((item) => (
                  <MentorExpandChatCard
                    key={item.mentoringId}
                    isChecked={item.isChecked}
                    mentoringId={item.mentoringId}
                    profileImageUrl={item.profileImageUrl}
                    nickname={item.nickname}
                    message={`님이 멘티 신청을 수락했어요.`}
                    date={item.createdAt}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </MentorWaitingListBox>

      <MentorWaitingListBox hasExpand={pendingList.length > DEFAULT_VISIBLE_ITEMS} className="mx-5 mt-2">
        {({ isExpanded }) => (
          <div className="space-y-2">
            <h3 className="mt-3 px-5 typo-sb-5 text-k-900">수락 대기중</h3>
            <div className="space-y-2 p-4">
              {pendingList.length === 0 ? (
                <div className="px-4 py-3">
                  <EmptySdwBCards message="멘토 신청 내역이 없습니다." />
                </div>
              ) : (
                (isExpanded ? pendingList : pendingList.slice(0, DEFAULT_VISIBLE_ITEMS)).map((item) => (
                  <MentorChatCard
                    key={item.mentoringId}
                    profileImageUrl={item.profileImageUrl}
                    nickname={item.nickname}
                    description={`님에게 멘티 신청을 보냈어요.`}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </MentorWaitingListBox>
    </div>
  );
};
export default WaitingContent;
