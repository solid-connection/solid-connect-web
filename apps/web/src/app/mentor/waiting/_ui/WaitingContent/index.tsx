"use client";

import { useGetApplyMentoringList } from "@/apis/mentor";
import MentorChatCard from "@/components/mentor/MentorChatCard/index";
import MentorExpandChatCard from "@/components/mentor/MentorExpandChatCard";
import EmptySdwBCards from "@/components/ui/EmptySdwBCards";

import { VerifyStatus } from "@/types/mentee";
import useIsDesktopViewport from "@/utils/useIsDesktopViewport";
import MentorWaitingListBox from "./_ui/MentorWaitingListBox";

const DEFAULT_VISIBLE_ITEMS = 2;

const WaitingContent = () => {
  const { data: approveList = [] } = useGetApplyMentoringList(VerifyStatus.APPROVED);
  const { data: pendingList = [] } = useGetApplyMentoringList(VerifyStatus.PENDING);
  const isDesktop = useIsDesktopViewport();
  const totalLength = approveList.length + pendingList.length;

  if (isDesktop === null) return null;

  if (isDesktop) {
    return (
      <div className="min-h-screen bg-k-50 px-8 py-8 lg:px-10">
        <header className="mb-8">
          <p className="text-primary typo-sb-9">Mentor</p>
          <h1 className="mt-2 text-k-900 typo-bold-1">멘토링 신청 목록</h1>
          <p className="mt-2 max-w-2xl text-k-500 typo-medium-2">
            수락된 멘토링과 아직 대기 중인 신청을 한 화면에서 확인하세요.
          </p>
        </header>

        <div className="grid items-start gap-8 xl:grid-cols-2">
          <section className="rounded-lg border border-k-100 bg-white p-6">
            <DesktopListHeader title="수락 완료" count={approveList.length} />
            <div className="mt-5 grid gap-3">
              {approveList.length === 0 ? (
                <EmptySdwBCards message="신규 매칭된 멘토가 없어요." />
              ) : (
                approveList.map((item) => (
                  <MentorExpandChatCard
                    key={item.mentoringId}
                    isChecked={item.isChecked}
                    mentoringId={item.mentoringId}
                    profileImageUrl={item.profileImageUrl}
                    nickname={item.nickname}
                    message="멘토가 멘티 신청을 수락했어요."
                    date={item.createdAt}
                  />
                ))
              )}
            </div>
          </section>

          <section className="rounded-lg border border-k-100 bg-white p-6">
            <DesktopListHeader title="수락 대기중" count={pendingList.length} />
            <div className="mt-5 grid gap-3">
              {pendingList.length === 0 ? (
                <EmptySdwBCards message="멘토 신청 내역이 없습니다." />
              ) : (
                pendingList.map((item) => (
                  <MentorChatCard
                    key={item.mentoringId}
                    profileImageUrl={item.profileImageUrl}
                    nickname={item.nickname}
                    description="멘토에게 멘티 신청을 보냈어요."
                  />
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-3 mt-5 flex justify-between px-5">
        <div className="flex items-center">
          <h2 className="mr-2 text-k-900 typo-sb-5">대기 중인 멘토링</h2>
          {totalLength > DEFAULT_VISIBLE_ITEMS && (
            <span className="rounded-2xl bg-primary-1 px-2 text-k-0">{totalLength - DEFAULT_VISIBLE_ITEMS}+</span>
          )}
        </div>
      </div>
      <MentorWaitingListBox hasExpand={approveList.length > DEFAULT_VISIBLE_ITEMS} className="mx-5 mt-2">
        {({ isExpanded }) => (
          <div className="space-y-2">
            <h3 className="mt-3 px-5 text-k-900 typo-sb-5">수락 완료</h3>
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
                    message="멘토가 멘티 신청을 수락했어요."
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
            <h3 className="mt-3 px-5 text-k-900 typo-sb-5">수락 대기중</h3>
            <div className="space-y-2">
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
                    description="멘토에게 멘티 신청을 보냈어요."
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

const DesktopListHeader = ({ title, count }: { title: string; count: number }) => (
  <div className="flex items-center justify-between">
    <h2 className="text-k-900 typo-bold-4">{title}</h2>
    <span className="rounded-full bg-primary-1 px-2.5 py-1 text-k-0 typo-medium-3">{count}</span>
  </div>
);

export default WaitingContent;
