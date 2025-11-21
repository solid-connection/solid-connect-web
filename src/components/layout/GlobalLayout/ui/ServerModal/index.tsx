import dynamic from "next/dynamic";
import { cookies } from "next/headers";

import { isTokenExpired } from "@/utils/jwtUtils";

// 🎯 Critical Path에서 제외하기 위해 지연 로딩
const MentorApplyCountModal = dynamic(() => import("@/components/mentor/MentorApplyCountModal"), {
  ssr: false, // 클라이언트에서만 로딩
  loading: () => null, // 로딩 중에는 아무것도 표시하지 않음
});

const ServerModal = async () => {
  // 서버에서 로그인 상태 확인
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const isNeededLogin = !refreshToken || isTokenExpired(refreshToken);
  return <>{isNeededLogin ? null : <MentorApplyCountModal />}</>;
};
export default ServerModal;
