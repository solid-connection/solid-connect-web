"use client";

import UniversityCard from "@/components/ui/UniverSityCard";

import useGetMyInfo from "@/api/my/client/useGetMyInfo";
import useGetMyWishUniversity from "@/api/university/client/useGetMyWishUniversity";

const FavoriteContent = () => {
  const { data: myInfo = {} } = useGetMyInfo();
  const { nickname } = myInfo;
  const { data: wishUniversity = [] } = useGetMyWishUniversity();

  return (
    <div className="px-5 pt-6">
      <p className="font-pretendard text-xl font-semibold text-k-700">
        {nickname} 님이
        <br />
        관심있는 학교
      </p>
      <div className="mt-5">
        {wishUniversity.length === 0 ? (
          <p className="py-20 text-center text-sm text-k-400">관심 학교가 없습니다.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 px-5 pb-10">
            {wishUniversity.map((university) => (
              <UniversityCard key={university.id} university={university} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoriteContent;
