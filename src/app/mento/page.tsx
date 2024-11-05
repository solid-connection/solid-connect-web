import React from "react";

import { IconClock } from "@/public/svgs";

const MentorPage = () => {
  return <MentorComingSoon />;
};

export default MentorPage;

const MentorComingSoon = () => {
  return (
    <div className="box-border flex min-h-[80vh] flex-col items-center justify-center p-4">
      <div className="w-[90%] max-w-[400px] rounded-lg bg-white p-8 text-center shadow-md md:max-w-[450px] md:p-12">
        <IconClock className="mx-auto mb-6 h-[25vw] max-h-[6rem] w-[25vw] max-w-[6rem] text-primary-1 md:mb-8 md:h-[8rem] md:w-[8rem]" />
        <h2 className="mb-4 text-[1.25rem] font-bold text-primary-2 md:mb-6 md:text-[1.75rem]">멘토 기능 준비 중</h2>
        <p className="mb-6 text-sm leading-[1.5] text-[#4a5568] md:mb-10 md:text-base">
          여러분을 위한 멘토링 서비스를 준비하고 있습니다.
          <br />
          조금만 기다려 주세요!
        </p>
        <div className="mx-auto h-[2px] w-12 bg-primary-1 md:w-16" />
      </div>
    </div>
  );
};
