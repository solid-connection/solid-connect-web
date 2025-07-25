import { cookies } from "next/headers";

import { isTokenExpired } from "@/utils/jwtUtils";

import MentorApplyCountModal from "@/components/mentor/MentorApplyCountModal";

const RootModal = () => {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const isNeededLogin = !refreshToken || isTokenExpired(refreshToken);

  return isNeededLogin ? null : <MentorApplyCountModal />;
};

export default RootModal;
