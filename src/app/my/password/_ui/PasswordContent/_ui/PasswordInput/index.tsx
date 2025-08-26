// src/components/PasswordInput.jsx
import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import clsx from "clsx";

import { IconAlertErrorRed, IconCheckBlue, IconVisibilityOff, IconVisibilityOn } from "@/public/svgs/my";

interface PasswordInputProps {
  name: string;
  label: string;
  placeholder?: string;
  autoFocus?: boolean;
  approveMessage?: string; // Optional approve message
}

const PasswordInput = ({
  name,
  label,
  placeholder = "8자리 이상 입력해주세요.",
  autoFocus = false,
  approveMessage = "사용 가능한 비밀번호입니다.",
}: PasswordInputProps) => {
  const { control } = useFormContext();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const hasError = fieldState.invalid;
        const isValid = fieldState.isDirty && !hasError;

        return (
          <div className="mb-6">
            <label htmlFor={name} className="mb-2 block text-base font-bold text-gray-800">
              {label}
            </label>
            <div className="relative flex items-center">
              <input
                {...field}
                id={name}
                type={isPasswordVisible ? "text" : "password"}
                placeholder={placeholder}
                autoFocus={autoFocus}
                className={clsx(
                  "w-full rounded-lg border p-4 pr-20 transition-colors focus:outline-none focus:ring-2",
                  hasError
                    ? "border-red-500 focus:border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:border-primary-500 focus:ring-primary-400",
                )}
              />
              <div className="absolute right-3 flex items-center space-x-2">
                <button type="button" onClick={togglePasswordVisibility} className="text-2xl text-gray-500">
                  {isPasswordVisible ? <IconVisibilityOn /> : <IconVisibilityOff />}
                </button>
              </div>
            </div>
            {isValid && (
              <div className="mt-1.5 flex items-center gap-1 text-sm">
                <IconCheckBlue />
                <span className="text-secondary">{approveMessage}</span>
              </div>
            )}
            {fieldState.error && (
              <div className="mt-1.5 flex items-center gap-1 text-sm">
                <IconAlertErrorRed />
                <span className="text-xs text-red-500">{fieldState.error.message}</span>
              </div>
            )}
          </div>
        );
      }}
    />
  );
};
export default PasswordInput;
