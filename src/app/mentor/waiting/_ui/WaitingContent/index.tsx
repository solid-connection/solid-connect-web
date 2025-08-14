"use client";

import EmptySdwBCards from "@/components/ui/EmptySdwBCards";

import MentorExpandChatCard from "../../../../../components/mentor/MentorExpandChatCard";
import MentorWaitingListBox from "./_ui/MentorWaitingListBox";

import { VerifyStatus } from "@/types/mentee";

import useGetApplyMentoringList from "@/api/mentee/client/useGetApplyMentoringList";
import usePatchCheckMentorings from "@/api/mentee/client/usePatchCheckMentorings";

const DEFAULT_VISIBLE_ITEMS = 2;

const WaitingContent = () => {
  const { data: approveList = [] } = useGetApplyMentoringList(VerifyStatus.APPROVED);
  const { data: pendingList = [] } = useGetApplyMentoringList(VerifyStatus.PENDING);
  const totalLength = approveList.length + pendingList.length;

  const { mutate: patchCheckMentorings } = usePatchCheckMentorings();

  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-3 mt-5 flex justify-between px-5">
        <div className="flex items-center">
          <h2 className="mr-2 text-lg font-semibold text-k-900">대기 중인 멘토링</h2>
          {totalLength > DEFAULT_VISIBLE_ITEMS && (
            <span className="rounded-2xl bg-primary-1 px-2 text-k-0">{totalLength - 2}+</span>
          )}
        </div>
      </div>
      <MentorWaitingListBox hasExpand={approveList.length > DEFAULT_VISIBLE_ITEMS} className="mx-5 mt-2">
        {({ isExpanded }) => (
          <div className="space-y-2">
            <h3 className="mt-3 px-5 text-[18px] font-semibold text-k-900">수락 완료</h3>
            <div className="space-y-2">
              {approveList.length === 0 ? (
                <div className="px-4 py-3">
                  <EmptySdwBCards message="신규 매칭된 멘토가 없어요." />
                </div>
              ) : (
                (isExpanded ? approveList : approveList.slice(0, DEFAULT_VISIBLE_ITEMS)).map((item) => (
                  <button
                    key={item.mentoringId}
                    onClick={() => patchCheckMentorings({ checkedMentoringIds: [item.mentoringId] })}
                  >
                    <MentorExpandChatCard
                      hasExpand
                      isChecked={item.isChecked}
                      mentoringId={item.mentoringId}
                      key={item.mentoringId}
                      profileImageUrl={item.profileImageUrl}
                      nickname={item.nickname}
                      message={`님이 멘티 신청을 수락했어요.`}
                      date={item.createdAt}
                    />
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </MentorWaitingListBox>

      <MentorWaitingListBox hasExpand={pendingList.length > DEFAULT_VISIBLE_ITEMS} className="mx-5 mt-2">
        {({ isExpanded }) => (
          <div className="space-y-2">
            <h3 className="mt-3 px-5 text-[18px] font-semibold text-k-900">수락 대기중</h3>
            <div className="space-y-2">
              {pendingList.length === 0 ? (
                <div className="px-4 py-3">
                  <EmptySdwBCards message="멘토 신청 내역이 없습니다." />
                </div>
              ) : (
                (isExpanded ? pendingList : pendingList.slice(0, DEFAULT_VISIBLE_ITEMS)).map((item) => (
                  <MentorExpandChatCard
                    hasExpand={false}
                    key={item.mentoringId}
                    mentoringId={item.mentoringId}
                    profileImageUrl={item.profileImageUrl}
                    nickname={item.nickname}
                    message={`님에게 멘티 신청을 보냈어요.`}
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
