import { cookies } from "next/headers";

import { isTokenExpired } from "@/utils/jwtUtils";

import MentorApplyCountModal from "@/components/mentor/MentorApplyCountModal";

const ServerModal = () => {
  // 서버에서 로그인 상태 확인
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const isNeededLogin = !refreshToken || isTokenExpired(refreshToken);
  return <>{isNeededLogin ? null : <MentorApplyCountModal />}</>;
};
export default ServerModal;
