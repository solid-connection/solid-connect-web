import { useEffect, useState } from "react";

// TO do 추후에 로컬 스토리지 키를 환경 변수로 관리하는 것이 좋습니다.
// 현재는 간단한 예시로 로컬 스토리지 키를 상수로 정의합니다.
// 또한 동일 디바이스에서 다른 유저 로그인 시에도 첫 방문 메시지가 표시되지 않도록 로컬 스토리지 키를 재설정하는 로직 필요합니다
// 로컬스토리지 관련 로직 분리가필요 허나 비즈니스 로직 관련 폴더가 없어 논의 필요
const MENTO_FIRST_VISIT_LOCAL_STORAGE_KEY = "mentor-dropdown-first-visit";

export default function useFirstVisit() {
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(false);

  // 첫 방문 확인 및 메시지 표시 로직
  useEffect(() => {
    const hasVisited = localStorage.getItem(MENTO_FIRST_VISIT_LOCAL_STORAGE_KEY);
    if (!hasVisited) {
      setIsFirstVisit(true);
    }
  }, []);

  const markAsVisited = () => {
    localStorage.setItem(MENTO_FIRST_VISIT_LOCAL_STORAGE_KEY, "true");
    setIsFirstVisit(false);
  };

  return {
    isFirstVisit,
    markAsVisited,
  };
}
