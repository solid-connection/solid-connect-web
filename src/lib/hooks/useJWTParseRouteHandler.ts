import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { parseJwt } from "@/utils/jwtUtils";

import { getAccessTokenWithReissue } from "../zustand/useTokenStore";

import { UserRole } from "@/types/mentor";

interface UseJWTParseRouteHandlerReturn {
  isMentor: boolean;
  isLoading: boolean;
  userId: number;
  expiredAt: Date | null;
}

const useJWTParseRouteHandler = (): UseJWTParseRouteHandlerReturn => {
  const router = useRouter();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userId, setUserId] = useState<number>(-1);
  const [expiredAt, setExpiredAt] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndDecode = async () => {
      const token = await getAccessTokenWithReissue();
      if (!token) {
        router.push("/login");
        setIsLoading(false);
        return;
      }

      const decoded = parseJwt(token);
      const role = decoded?.role as UserRole | null;
      const id = decoded?.sub ? Number(decoded.sub) : -1;
      const expiration = decoded?.exp ? new Date(decoded.exp * 1000) : null;

      setUserRole(role);
      setUserId(id);
      setExpiredAt(expiration);
      setIsLoading(false);
    };

    fetchAndDecode();
  }, []);

  const isMentor = userRole?.toUpperCase() === UserRole.MENTOR;
  return { isMentor, userId, expiredAt, isLoading };
};

export default useJWTParseRouteHandler;
