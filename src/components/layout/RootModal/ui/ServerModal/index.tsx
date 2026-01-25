import MentorApplyCountModal from "@/components/mentor/MentorApplyCountModal";
import isServerStateLogin from "@/utils/isServerStateLogin";

const ServerModal = () => {
  // 서버에서 로그인 상태 확인
  const isServerLogin = isServerStateLogin();
  return <>{isServerLogin ? <MentorApplyCountModal /> : null}</>;
};
export default ServerModal;
