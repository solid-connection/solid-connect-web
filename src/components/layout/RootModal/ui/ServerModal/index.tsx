import isServerStateLogin from "@/utils/isServerStateLogin";

import MentorApplyCountModal from "@/components/mentor/MentorApplyCountModal";

const ServerModal = async () => {
  // 서버에서 로그인 상태 확인
  const isServerLogin = await isServerStateLogin();
  return <>{isServerLogin ? <MentorApplyCountModal /> : null}</>;
};
export default ServerModal;
