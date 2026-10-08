"use client";

import { useGetUniversityDetail } from "@/apis/universities";

import UniversityDetail from "./UniversityDetail";
import UniversityDetailPreparingFallback from "./UniversityDetailPreparingFallback";

interface UniversityDetailCsrFallbackProps {
  universityId: number;
  backHref: string;
}

/**
 * SSG(빌드 시점) 또는 서버 렌더 단계에서 대학 상세 데이터를 가져오지 못했을 때 사용하는 클라이언트 폴백.
 * 정적 생성 실패를 빈 화면으로 넘기지 않고, 브라우저에서 같은 API를 다시 조회해 내용을 채운다.
 */
const UniversityDetailCsrFallback = ({ universityId, backHref }: UniversityDetailCsrFallbackProps) => {
  const { data: university, isPending, isError } = useGetUniversityDetail(universityId);

  if (isPending) {
    return (
      <UniversityDetailPreparingFallback
        backHref={backHref}
        title="대학 정보를 불러오는 중입니다."
        description="잠시만 기다려주세요."
      />
    );
  }

  if (isError || !university) {
    return <UniversityDetailPreparingFallback backHref={backHref} />;
  }

  return (
    <div className="w-full">
      <UniversityDetail koreanName={university.koreanName} university={university} />
    </div>
  );
};

export default UniversityDetailCsrFallback;
