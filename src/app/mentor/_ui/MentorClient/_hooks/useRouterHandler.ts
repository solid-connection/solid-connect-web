import { useRouter } from "next/navigation";

import { getUserRoleFromJwt } from "@/utils/jwtUtils";

import { UserRole } from "@/types/mentor";

const useRouterHandler = (): boolean => {
  const userRole = getUserRoleFromJwt();

  const router = useRouter();

  if (!userRole) {
    alert("로그인이 필요합니다.");
    router.push("/login");
  }
  const isMentor = userRole === UserRole.MENTOR;
  return isMentor;
};

export default useRouterHandler;
