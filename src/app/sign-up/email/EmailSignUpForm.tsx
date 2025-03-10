"use client";

import { useState } from "react";

import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

import { IconEyeOff, IconEyeOn } from "@/public/svgs/ui";

const EmailSignUpForm = () => {
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordsVisible, setPasswordsVisible] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (!showPassword) {
      setShowPassword(true); // 이메일 입력 시 비밀번호 필드 표시
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordsVisible(!passwordsVisible);
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Label htmlFor="email" className="text-k-900">
          이메일
        </Label>
        <Input
          variant="gray"
          placeholder="ID@example.com"
          type="email"
          autoComplete="email"
          value={email}
          onChange={handleEmailChange}
        />
      </div>
      {showPassword && (
        <>
          <div className="relative">
            <Label htmlFor="password" className="text-k-900">
              비밀번호
            </Label>
            <div className="relative">
              <Input
                variant="gray"
                placeholder="비밀번호를 입력해주세요"
                type={passwordsVisible ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3.5 top-1/2 -translate-y-1/2"
              >
                {passwordsVisible ? <IconEyeOn /> : <IconEyeOff />}
              </button>
            </div>
          </div>
          <div className="relative">
            <Label htmlFor="passwordConfirm" className="text-k-900">
              비밀번호 확인
            </Label>
            <div className="relative">
              <Input
                variant="gray"
                placeholder="비밀번호를 다시 입력해주세요"
                type={passwordsVisible ? "text" : "password"}
                autoComplete="new-password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EmailSignUpForm;
