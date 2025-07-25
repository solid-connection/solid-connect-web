import EmptySdwBCards from "@/components/ui/EmptySdwBCards";

import MentorExpandChatCard from "./_components/MentorExpandChatCard";

const request = {
  requests: [
    {
      mentoringId: 1,
      profileImageUrl: "/images/profile1.jpg",
      nickname: "김민수",
      isChecked: true,
      createAt: "2024-01-15T10:30:00Z",
    },
    {
      mentoringId: 2,
      profileImageUrl: "/images/profile2.jpg",
      nickname: "이소영",
      isChecked: false,
      createAt: "2024-01-14T14:20:00Z",
    },
    {
      mentoringId: 3,
      profileImageUrl: "",
      nickname: "박준호",
      isChecked: true,
      createAt: "2024-01-13T09:15:00Z",
    },
    {
      mentoringId: 4,
      profileImageUrl: "/images/profile4.jpg",
      nickname: "정수빈",
      isChecked: false,
      createAt: "2024-01-12T16:45:00Z",
    },
    {
      mentoringId: 5,
      profileImageUrl: "/images/profile5.jpg",
      nickname: "홍길동",
      isChecked: false,
      createAt: "2024-01-11T11:30:00Z",
    },
  ],
};

const getWaitingMentoringList = () => {
  return request.requests;
};

const WatingContent = () => {
  const completeWatingList = getWaitingMentoringList();
  const abroadWatingList = getWaitingMentoringList();
  const watingAllList = completeWatingList.concat(abroadWatingList);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-3 mt-5 flex justify-between px-5">
        <div className="flex items-center">
          <h2 className="mr-2 text-lg font-semibold text-k-900">대기 중인 멘토링</h2>
          {watingAllList.length > 2 && (
            <span className="rounded-2xl bg-primary-1 px-2 text-k-0">{watingAllList.length - 2}+</span>
          )}
        </div>
      </div>
      <h3 className="px-5 text-[18px] font-semibold text-k-900">수학 완료</h3>
      <div className="space-y-2">
        {completeWatingList.length === 0 ? (
          <EmptySdwBCards message="신규 매칭된 멘토가 없어요." />
        ) : (
          completeWatingList.map((item) => (
            <MentorExpandChatCard
              key={item.mentoringId}
              profileImageUrl={item.profileImageUrl}
              nickname={item.nickname}
              message={`님이 멘토링을 신청했습니다 `}
              date={item.createAt}
            />
          ))
        )}
      </div>
      <h3 className="mt-6 px-5 text-[18px] font-semibold text-k-900">수학 대기중</h3>
      <div className="space-y-2">
        {abroadWatingList.length === 0 ? (
          <EmptySdwBCards />
        ) : (
          abroadWatingList.map((item) => (
            <MentorExpandChatCard
              key={item.mentoringId}
              profileImageUrl={item.profileImageUrl}
              nickname={item.nickname}
              message={`님이 멘토링을 수락했습니다 `}
              date={item.createAt}
            />
          ))
        )}
      </div>
    </div>
  );
};
export default WatingContent;
