"use client";

import { Dispatch, SetStateAction, useRef, useState } from "react";

import BlockBtn from "@/components/button/BlockBtn";
import { Input } from "@/components/ui/Inputa";

import { toast } from "@/lib/zustand/useToastStore";
import { IconSignupProfileImage } from "@/public/svgs/auth";

type SignupProfileScreenProps = {
  toNextStage: () => void;
  nickname: string;
  setNickname: Dispatch<SetStateAction<string>>;
  defaultProfileImageUrl: string;
  profileImageFile: File | null;
  setProfileImageFile: Dispatch<SetStateAction<File | null>>;
};

const SignupProfileScreen = ({
  toNextStage,
  nickname,
  setNickname,
  defaultProfileImageUrl,
  profileImageFile,
  setProfileImageFile,
}: SignupProfileScreenProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedProfileImageFileView, setUploadedProfileImageFileView] = useState<string | null>(null);

  const submit = () => {
    if (!nickname) {
      toast.error("닉네임을 입력해주세요.");
      return;
    }
    toNextStage();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedProfileImageFileView(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const getImage = () => {
    if (uploadedProfileImageFileView) {
      return (
        <img src={uploadedProfileImageFileView} alt="프로필 이미지" className="h-[120px] w-[120px] rounded-full" />
      );
    }
    if (defaultProfileImageUrl) {
      return <img src={defaultProfileImageUrl} alt="프로필 이미지" className="h-[120px] w-[120px] rounded-full" />;
    }
    return <IconSignupProfileImage />;
  };

  return (
    <div className="mb-40">
      <div className="px-5">
        <div className="mt-5">
          <span className="text-k-900 typo-bold-1">
            닉네임을
            <br />
            등록해주세요.
          </span>
        </div>

        <div className="mt-[30px]">
          <div className="flex justify-center">
            <div className="cursor-pointer" onClick={handleImageClick}>
              {getImage()}
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
          </div>

          <div className="mt-[30px]">
            <label htmlFor="nickname" className="mb-1 text-k-900 typo-sb-7">
              닉네임
            </label>
            <Input
              id="nickname"
              variant="gray"
              type="text"
              placeholder="닉네임을 입력해주세요"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            {/* TODO: 닉네임 검증 실시간 보여주기 추가 */}
          </div>
        </div>
      </div>

      <div className="fixed bottom-14 w-full max-w-app bg-white">
        <div className="px-5">
          <BlockBtn className="mb-[29px]" disabled={!nickname} onClick={submit}>
            가입 완료
          </BlockBtn>
        </div>
      </div>
    </div>
  );
};

export default SignupProfileScreen;
