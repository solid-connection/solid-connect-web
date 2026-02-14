"use client";

import clsx from "clsx";
import { FormProvider } from "react-hook-form";

import CloudSpinnerPage from "@/components/ui/CloudSpinnerPage";
import { UserRole } from "@/types/mentor";
import useModifyUserHookform from "./_hooks/useModifyUserHookform";
import ImageInputFiled from "./_ui/ImageInputFiled";
import InputField from "./_ui/InputFiled";
import ReadOnlyField from "./_ui/ReadOnlyField";

const ModifyContent = () => {
  const { methods, myInfo, onSubmit } = useModifyUserHookform();

  const defaultUniversity: string =
    (myInfo?.role === UserRole.MENTOR || myInfo?.role === UserRole.ADMIN) && myInfo.attendedUniversity
      ? myInfo.attendedUniversity
      : "인하대학교";

  const {
    handleSubmit,
    formState: { isValid, isDirty },
  } = methods;

  if (!myInfo) {
    return <CloudSpinnerPage />;
  }
  return (
    <FormProvider {...methods}>
      <div className="px-5 py-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Image Section */}
          <ImageInputFiled initImagePreview={myInfo.profileImageUrl ?? null} />

          {/* Form Fields */}
          <div className="space-y-2">
            {/* 닉네임 - 수정 가능 */}
            <InputField name="nickname" label="닉네임" placeholder="닉네임을 입력해주세요" />

            {/* 출신학교 - 읽기 전용 */}
            <ReadOnlyField label="출신학교" value={defaultUniversity} placeholder="서울대학교" />

            {/* 수학 학교 - 읽기 전용 */}
            <ReadOnlyField label="수학 학교" value="컴퓨터공학과" placeholder="전공" />

            {/* 사용자 유형 - 읽기 전용 */}
            <ReadOnlyField
              label="사용자 유형"
              value={myInfo.role === UserRole.ADMIN ? "어드민" : myInfo.role === UserRole.MENTOR ? "멘토" : "멘티"}
              placeholder="멘티"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={!isValid || !isDirty}
              className={clsx(
                "w-full rounded-lg py-4 text-white transition-colors typo-sb-9",
                isValid && isDirty ? "bg-primary hover:bg-primary-600" : "cursor-not-allowed bg-k-400",
              )}
            >
              저장하기
            </button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
};

export default ModifyContent;
