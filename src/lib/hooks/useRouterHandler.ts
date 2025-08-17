import { useEffect, useState } from "react";

import { getUserRoleFromJwt } from "@/utils/jwtUtils";

import { UserRole } from "@/types/mentor";

interface useRouterHandler {
  isMentor: boolean;
  isLoaded: boolean;
}

const useRouterHandler = (): useRouterHandler => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoaded, setIsLoaded] = useState(true);

  useEffect(() => {
    // 클라이언트에서만 JWT를 읽어서 역할 결정
    const role = getUserRoleFromJwt();
    setUserRole(role);
    setIsLoaded(false);
  }, []);

  const isMentor = userRole?.toUpperCase() === UserRole.MENTOR;
  return { isMentor, isLoaded };
};

export default useRouterHandler;
