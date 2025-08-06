import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { getUserRoleFromJwt } from "@/utils/jwtUtils";

import { UserRole } from "@/types/mentor";

const useRouterHandler = (): boolean => {
  const userRole = getUserRoleFromJwt();

  const router = useRouter();

  useEffect(() => {
    if (!userRole) {
      alert("로그인이 필요합니다.");
      router.push("/login");
    }
  }, [userRole, router]);

  const isMentor = userRole === UserRole.MENTOR;
  return isMentor;
};

export default useRouterHandler;
