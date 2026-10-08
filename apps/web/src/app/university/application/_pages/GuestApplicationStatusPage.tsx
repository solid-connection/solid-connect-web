"use client";

import Link from "next/link";
import RestrictedApplicationStatusView from "../_components/RestrictedApplicationStatusView";

const GuestApplicationStatusPage = () => (
  <RestrictedApplicationStatusView
    showPlaceholderRows
    guestOverlay={
      <div className="absolute inset-x-0 top-[134px] z-10 flex min-h-[550px] items-center bg-white/80 px-5 backdrop-blur-[3px]">
        <div className="-mt-14 flex w-full flex-col items-center gap-4 text-center">
          <p className="text-k-900 typo-medium-1">로그인하고 지금 바로 경쟁률을 확인하세요.</p>
          <Link
            href="/login"
            className="flex h-[52px] w-full items-center justify-center rounded-lg bg-primary text-k-0 typo-medium-1"
          >
            로그인하러가기
          </Link>
        </div>
      </div>
    }
  />
);

export default GuestApplicationStatusPage;
