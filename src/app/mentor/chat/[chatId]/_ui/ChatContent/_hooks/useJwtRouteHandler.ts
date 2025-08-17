import { useRouter } from "next/navigation";

import { getUserIdFromJwt, getUserRoleFromJwt } from "@/utils/jwtUtils";

import { UserRole } from "@/types/mentor";

interface UseJwtRouteHandlerReturn {
  isMentor: boolean;
  currentUserId: number;
}

const useJwtRouteHandler = (): UseJwtRouteHandlerReturn => {
  // 첨부파일 옵션 상태
  const isMentor = getUserRoleFromJwt() === UserRole.MENTOR;

  const currentUserId = getUserIdFromJwt();
  const router = useRouter();
  // 현재 사용자 ID가 없으면 404 페이지로 이동
  if (!currentUserId) {
    alert("로그인이 필요합니다.");
    router.push("/login");
    return { isMentor, currentUserId: 0 }; // 더미 값으로 타입 단언
  }

  return {
    isMentor,
    currentUserId,
  };
};
export default useJwtRouteHandler;
