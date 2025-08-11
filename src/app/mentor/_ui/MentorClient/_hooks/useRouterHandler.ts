import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { getUserRoleFromJwt } from "@/utils/jwtUtils";

import { UserRole } from "@/types/mentor";

const useRouterHandler = (): boolean => {
  const userRole = getUserRoleFromJwt();

  const isMentor = userRole === UserRole.MENTOR;
  return isMentor;
};

export default useRouterHandler;
