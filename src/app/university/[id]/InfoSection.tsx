"use client";

import { useState } from "react";

const InfoSection = () => {
  const [detailForApplyFold, setDetailForApplyFold] = useState<boolean>(true);
  const [detailForAccomodationFold, setDetailForAccommodationFold] = useState<boolean>(true);

  return (
    <div>
      <div className="h-1 bg-k-50" />
      <div className="my-7 flex flex-col gap-2.5">
        {/* 최저 이수학기 */}
        <div className="flex h-[50px] items-center justify-between px-3">
          <div className="flex items-center gap-2.5">
            <SemesterRequirementIcon />
            <span className="text-base font-semibold text-k-900">최저 이수학기</span>
          </div>
          <div className="flex h-7 w-[50px] items-center justify-center rounded-full bg-k-50">
            <span className="text-[13px] font-semibold leading-normal text-primary">2학기</span>
          </div>
        </div>
        {/* 파견 가능학기 */}
        <div className="flex h-[50px] items-center justify-between px-3">
          <div className="flex items-center gap-2.5">
            <SemesterAvailableForDispatchIcon />
            <span className="text-base font-semibold text-k-900">파견 가능학기</span>
          </div>
          <div className="flex h-7 w-[50px] items-center justify-center rounded-full bg-k-50">
            <span className="text-[13px] font-semibold leading-normal text-primary">2학기</span>
          </div>
        </div>
        {/* 자격요건 */}
        {detailForApplyFold ? (
          <div
            className="flex h-[50px] items-center justify-between rounded-sm bg-k-50 px-3"
            onClick={() => setDetailForApplyFold(false)}
            role="button"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setDetailForApplyFold(false);
              }
            }}
          >
            <div className="flex items-center gap-2.5">
              <DetailForApplyIcon />
              <span className="text-base font-semibold text-k-900">자격요건</span>
            </div>
            <div className="flex h-7 w-[50px] items-center justify-center rounded-full bg-k-50">
              <FoldIcon />
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col gap-1.5 bg-k-50 px-3 pb-[18px] pt-2.5"
            onClick={() => setDetailForApplyFold(true)}
            role="button"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setDetailForApplyFold(true);
              }
            }}
          >
            <div className="flex items-center justify-between rounded-sm">
              <div className="flex items-center gap-2.5">
                <DetailForApplyIcon />
                <span className="text-base font-semibold text-k-900">자격요건</span>
              </div>
              <div className="flex h-7 w-[50px] items-center justify-center rounded-full bg-k-50">
                <UnFoldIcon />
              </div>
            </div>
            <div className="pl-11">
              <span className="text-sm font-medium leading-normal text-k-700">
                파견시점의 학기가 8차인 경우 지원 불가. 본교에서 2학기 이상 수학한 학생만 파견 가능
              </span>
            </div>
          </div>
        )}
        {/* 기숙사 */}
        {detailForAccomodationFold ? (
          <div
            className="flex h-[50px] items-center justify-between rounded-sm bg-k-50 px-3"
            onClick={() => setDetailForAccommodationFold(false)}
            role="button"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setDetailForAccommodationFold(false);
              }
            }}
          >
            <div className="flex items-center gap-2.5">
              <DetailForAccommodationIcon />
              <span className="text-base font-semibold text-k-900">자격요건</span>
            </div>
            <div className="flex h-7 w-[50px] items-center justify-center rounded-full bg-k-50">
              <FoldIcon />
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col gap-1.5 bg-k-50 px-3 pb-[18px] pt-2.5"
            onClick={() => setDetailForAccommodationFold(true)}
            role="button"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setDetailForAccommodationFold(true);
              }
            }}
          >
            <div className="flex items-center justify-between rounded-sm">
              <div className="flex items-center gap-2.5">
                <DetailForAccommodationIcon />
                <span className="text-base font-semibold text-k-900">자격요건</span>
              </div>
              <div className="flex h-7 w-[50px] items-center justify-center rounded-full bg-k-50">
                <UnFoldIcon />
              </div>
            </div>
            <div className="pl-11">
              <span className="text-sm font-medium leading-normal text-k-700">
                기숙사 미제공, 학생 아파트 중계 사이트 제공
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoSection;

const FoldIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
      <path d="M9 13.5L15 19.5L21 13.5" stroke="#5950F6" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
};

const UnFoldIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
      <path d="M21 19.5L15 13.5L9 19.5" stroke="#5950F6" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
};

const SemesterRequirementIcon = () => {
  return (
    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect y="0.864258" width="24" height="24" rx="12" fill="#E8EDFD" />
      <path
        d="M8.67333 16.4643H17V8.06426C17 7.746 16.8829 7.44077 16.6746 7.21573C16.4662 6.99069 16.1836 6.86426 15.8889 6.86426H8.66667C7.99667 6.86426 7 7.34366 7 8.66426V17.0643C7 18.3849 7.99667 18.8643 8.66667 18.8643H17V17.6643H8.67333C8.41667 17.6571 8.11111 17.5473 8.11111 17.0643C8.11111 16.5813 8.41667 16.4715 8.67333 16.4643ZM9.77778 9.26426H14.7778V10.4643H9.77778V9.26426Z"
        fill="#5C82F0"
      />
    </svg>
  );
};

const SemesterAvailableForDispatchIcon = () => {
  return (
    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect y="0.727539" width="24" height="24" rx="12" fill="#FFF2DD" />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M14.7512 14.1561H17.3709C17.8029 14.1561 18.2173 13.968 18.5228 13.6331C18.8284 13.2982 19 12.844 19 12.3704C19 11.8968 18.8284 11.4426 18.5228 11.1077C18.2173 10.7728 17.8029 10.5847 17.3709 10.5847H8.32465C8.20367 10.5846 8.08509 10.5476 7.98219 10.4779C7.8793 10.4081 7.79616 10.3083 7.74208 10.1897L7.45014 9.55111C7.39606 9.43248 7.31291 9.3327 7.21002 9.26293C7.10713 9.19317 6.98855 9.15618 6.86756 9.15611H5.65223C5.54434 9.15601 5.43811 9.18526 5.34308 9.24126C5.24806 9.29726 5.1672 9.37825 5.10777 9.47695C5.04834 9.57565 5.0122 9.68898 5.00259 9.80678C4.99298 9.92457 5.0102 10.0431 5.05271 10.1518L6.4492 13.7233C6.49948 13.8518 6.5831 13.9614 6.68968 14.0383C6.79625 14.1153 6.9211 14.1562 7.04872 14.1561H9.56605C9.67248 14.1562 9.77728 14.1848 9.87128 14.2396C9.96528 14.2943 10.0456 14.3734 10.1053 14.47C10.1649 14.5666 10.2021 14.6778 10.2135 14.7938C10.2249 14.9098 10.2103 15.0271 10.1708 15.1354L9.58364 16.749C9.54431 16.8572 9.52974 16.9744 9.54119 17.0902C9.55264 17.206 9.58977 17.317 9.64934 17.4135C9.70891 17.51 9.78911 17.5891 9.88295 17.6438C9.97679 17.6986 10.0814 17.7273 10.1877 17.7275H11.5184C11.6161 17.7276 11.7126 17.7035 11.8007 17.6572C11.8888 17.6108 11.9663 17.5433 12.0273 17.4597L14.2429 14.424C14.304 14.3404 14.3813 14.273 14.4693 14.2266C14.5573 14.1803 14.6536 14.1562 14.7512 14.1561ZM10.2027 9.8704H13.2981L12.0273 8.01325C11.9666 7.92454 11.8879 7.85254 11.7974 7.80295C11.707 7.75336 11.6072 7.72754 11.506 7.72754H10.2796C10.1686 7.7276 10.0594 7.75877 9.96243 7.81807C9.86547 7.87737 9.78394 7.96285 9.72557 8.06639C9.66721 8.16993 9.63396 8.2881 9.62896 8.40969C9.62397 8.53127 9.6474 8.65224 9.69703 8.76111L10.2027 9.8704Z"
        fill="#FF934B"
      />
    </svg>
  );
};

const DetailForApplyIcon = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="12" fill="#FCEFFF" />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M17 7H7V12.3846C7 13.6087 7.52678 14.7826 8.46447 15.6482C9.40215 16.5137 10.6739 17 12 17C13.3261 17 14.5979 16.5137 15.5355 15.6482C16.4732 14.7826 17 13.6087 17 12.3846V7ZM10.2117 10.9585L9.62167 11.5031L11.5833 13.3131L14.795 10.3492L14.2058 9.80462L11.5833 12.2254L10.2117 10.9585Z"
        fill="#B33BD4"
      />
    </svg>
  );
};

const DetailForAccommodationIcon = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="12" fill="#E4F7C0" />
      <path d="M7 17.5V10.1667L12 6.5L17 10.1667V17.5H13.25V13.2222H10.75V17.5H7Z" fill="#78A32C" />
    </svg>
  );
};
