import { useController, useFormContext } from "react-hook-form";

import clsx from "clsx";

import { IconCheckBlue } from "@/public/svgs/my";

// 입력 필드 컴포넌트
interface InputFieldProps {
  name: string;
  label: string;
  placeholder: string;
}

const InputField = ({ name, label, placeholder }: InputFieldProps) => {
  const { control } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  return (
    <div className="space-y-2">
      <label className="block typo-medium-2 text-k-700">{label}</label>
      <div className="relative">
        <input
          {...field}
          type="text"
          value={(field.value as string) ?? ""} // undefined일 때 빈 문자열
          placeholder={placeholder}
          className={clsx(
            "w-full rounded-lg border p-3 pr-12 text-primary placeholder:text-primary-200 focus:border-primary focus:outline-none",
            error ? "border-red-500" : "border-gray-300",
          )}
        />
      </div>
      {error && <p className="typo-regular-2 text-red-500">{error.message}</p>}
      {name === "nickname" && field.value && !error && (
        <div className="flex items-center gap-2 typo-regular-2 text-primary">
          <IconCheckBlue />
          <span>사용가능한 닉네임입니다.</span>
        </div>
      )}
    </div>
  );
};
export default InputField;
