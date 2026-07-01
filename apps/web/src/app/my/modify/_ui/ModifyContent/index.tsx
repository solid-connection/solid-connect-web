"use client";

import clsx from "clsx";
import { FormProvider } from "react-hook-form";

import CloudSpinnerPage from "@/components/ui/CloudSpinnerPage";
import { UserRole } from "@/types/mentor";
import useIsDesktopViewport from "@/utils/useIsDesktopViewport";
import useModifyUserHookform from "./_hooks/useModifyUserHookform";
import { resolveModifyProfileReadOnlyFields } from "./_lib/profileFields";
import ImageInputFiled from "./_ui/ImageInputFiled";
import InputField from "./_ui/InputFiled";
import ReadOnlyField from "./_ui/ReadOnlyField";

const ModifyContent = () => {
  const { methods, myInfo, onSubmit } = useModifyUserHookform();
  const isDesktop = useIsDesktopViewport(false);

  const {
    handleSubmit,
    formState: { isValid, isDirty },
  } = methods;

  if (!myInfo) {
    return <CloudSpinnerPage />;
  }

  const { homeUniversityName, attendedUniversity } = resolveModifyProfileReadOnlyFields(myInfo);
  const roleText = myInfo.role === UserRole.ADMIN ? "어드민" : myInfo.role === UserRole.MENTOR ? "멘토" : "멘티";
  const formProps = {
    homeUniversityName,
    attendedUniversity,
    isValid,
    isDirty,
    profileImageUrl: myInfo.profileImageUrl ?? null,
    roleText,
    onSubmit: handleSubmit(onSubmit),
  };

  return (
    <FormProvider {...methods}>
      {isDesktop ? <ModifyDesktopView {...formProps} /> : <ModifyMobileView {...formProps} />}
    </FormProvider>
  );
};

type ModifyViewProps = {
  homeUniversityName: string;
  attendedUniversity: string;
  isValid: boolean;
  isDirty: boolean;
  profileImageUrl: string | null;
  roleText: string;
  onSubmit: () => void;
};

const ModifyMobileView = ({
  homeUniversityName,
  attendedUniversity,
  isValid,
  isDirty,
  profileImageUrl,
  roleText,
  onSubmit,
}: ModifyViewProps) => {
  return (
    <div className="px-5 py-6">
      <ProfileEditForm
        homeUniversityName={homeUniversityName}
        attendedUniversity={attendedUniversity}
        isValid={isValid}
        isDirty={isDirty}
        profileImageUrl={profileImageUrl}
        roleText={roleText}
        onSubmit={onSubmit}
      />
    </div>
  );
};

const ModifyDesktopView = ({
  homeUniversityName,
  attendedUniversity,
  isValid,
  isDirty,
  profileImageUrl,
  roleText,
  onSubmit,
}: ModifyViewProps) => {
  return (
    <div className="min-h-screen bg-k-50 px-8 py-8 lg:px-10">
      <header className="mb-8">
        <p className="text-primary typo-sb-9">My Solid</p>
        <h1 className="mt-2 text-k-900 typo-bold-1">프로필 수정</h1>
        <p className="mt-2 text-k-500 typo-medium-2">프로필 이미지와 닉네임을 관리하세요.</p>
      </header>

      <div className="grid items-start gap-8 xl:grid-cols-[minmax(420px,640px)_minmax(280px,360px)]">
        <section className="rounded-lg border border-k-100 bg-white p-6">
          <ProfileEditForm
            homeUniversityName={homeUniversityName}
            attendedUniversity={attendedUniversity}
            isValid={isValid}
            isDirty={isDirty}
            profileImageUrl={profileImageUrl}
            roleText={roleText}
            onSubmit={onSubmit}
          />
        </section>

        <aside className="sticky top-8 rounded-lg border border-k-100 bg-white p-6">
          <h2 className="text-k-900 typo-bold-4">프로필 정보</h2>
          <div className="mt-5 space-y-4 text-k-600 typo-medium-3">
            <p>닉네임과 프로필 이미지는 커뮤니티, 멘토링, 채팅에서 함께 노출됩니다.</p>
            <p>학교와 사용자 유형은 서비스 이용 상태에 따라 관리되며 이 화면에서는 직접 수정할 수 없습니다.</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

const ProfileEditForm = ({
  homeUniversityName,
  attendedUniversity,
  isValid,
  isDirty,
  profileImageUrl,
  roleText,
  onSubmit,
}: ModifyViewProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <ImageInputFiled initImagePreview={profileImageUrl} />

      <div className="space-y-2">
        <InputField name="nickname" label="닉네임" placeholder="닉네임을 입력해주세요" />
        <ReadOnlyField label="출신학교" value={homeUniversityName} placeholder="등록된 출신학교가 없습니다" />
        <ReadOnlyField label="수학 학교" value={attendedUniversity} placeholder="등록된 수학 학교가 없습니다" />
        <ReadOnlyField label="사용자 유형" value={roleText} placeholder="멘티" />
      </div>

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
  );
};

export default ModifyContent;
