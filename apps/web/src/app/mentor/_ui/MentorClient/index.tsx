"use client";

import type { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useGetMyInfo } from "@/apis/MyPage";
import CloudSpinnerPage from "@/components/ui/CloudSpinnerPage";
import useAuthStore from "@/lib/zustand/useAuthStore";
import { UserRole } from "@/types/mentor";
import MenteePage from "./_ui/MenteePage";
import MentorPage from "./_ui/MentorPage";

const MentorClient = () => {
  const router = useRouter();
  const clientRole = useAuthStore((state) => state.clientRole);
  const { data: myInfo, isLoading, isFetching, isError, error, refetch } = useGetMyInfo();
  const role = myInfo?.role;
  const status = (error as AxiosError | null)?.response?.status;
  const isUnauthorized = status === 401 || status === 403;
  const isAuthResolving = isLoading || (isFetching && !role);

  useEffect(() => {
    if (isAuthResolving) return;
    if (isUnauthorized || (!isError && !role)) {
      router.replace("/login");
    }
  }, [isAuthResolving, isUnauthorized, isError, role, router]);

  if (isAuthResolving) {
    return <CloudSpinnerPage />;
  }

  if (isUnauthorized || (!isError && !role)) {
    return <CloudSpinnerPage />;
  }

  if (isError) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-k-700 typo-medium-2">멘토 페이지 정보를 불러오지 못했어요.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-full bg-primary px-4 py-2 text-white typo-medium-2"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (role === UserRole.ADMIN) {
    return clientRole === UserRole.MENTEE ? <MenteePage /> : <MentorPage />;
  }

  return role === UserRole.MENTOR ? <MentorPage /> : <MenteePage />;
};

export default MentorClient;
