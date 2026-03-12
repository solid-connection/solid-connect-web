import { useState } from "react";

interface UseInputHandlerReturn {
  showPasswordField: boolean;
  handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const useInputHandler = (): UseInputHandlerReturn => {
  // 비밀번호 필드 표시 상태를 위한 state
  const [showPasswordField, setShowPasswordField] = useState(false);

  // 이메일 입력 시 비밀번호 필드 표시 제어
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setShowPasswordField(value.length > 0);
  };
  return {
    showPasswordField,
    handleEmailChange,
  };
};
export default useInputHandler;
