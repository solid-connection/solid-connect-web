"use client";

import { Dispatch, SetStateAction, useRef, useState } from "react";

import BlockToggleBtn from "@/components/button/block-toggle-btn";

import styles from "./signup.module.css";

import { Gender, GenderEnum } from "@/types/auth";

import { IconSignupProfileImage } from "@/public/svgs";

type SignupProfileScreenProps = {
  toNextStage: () => void;
  nickname: string;
  setNickname: Dispatch<SetStateAction<string>>;
  gender: Gender | "";
  setGender: Dispatch<SetStateAction<Gender | "">>;
  birth: string;
  setBirth: Dispatch<SetStateAction<string>>;
  defaultProfileImageUrl: string;
  profileImageFile: File | null;
  setProfileImageFile: Dispatch<SetStateAction<File | null>>;
};

const SignupProfileScreen = ({
  toNextStage,
  nickname,
  setNickname,
  gender,
  setGender,
  birth,
  setBirth,
  defaultProfileImageUrl,
  profileImageFile,
  setProfileImageFile,
}: SignupProfileScreenProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedProfileImageFileView, setUploadedProfileImageFileView] = useState<string | null>(null);

  const submit = () => {
    if (!nickname) {
      alert("닉네임을 입력해주세요.");
      return;
    }
    if (!birth) {
      alert("생년월일을 입력해주세요.");
      return;
    }
    if (gender === "") {
      alert("성별을 선택해주세요.");
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
      return <img src={uploadedProfileImageFileView} alt="profile" />;
    }
    if (defaultProfileImageUrl) {
      return <img src={defaultProfileImageUrl} alt="profile" />;
    }
    return <IconSignupProfileImage />;
  };

  return (
    <div className={styles.screen}>
      <div className={styles["secondary-title"]}>가입 마지막 단계예요!</div>
      <div className={styles.title}>
        기본 회원 정보를
        <br />
        등록해주세요.
      </div>

      <div className={styles["profile-screen"]}>
        <div className={styles.profile__image}>
          <div className={styles["image-wrapper"]} onClick={handleImageClick}>
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

        <div className={styles.profile__nickname}>
          <label htmlFor="nickname">닉네임</label>
          <input
            id="nickname"
            type="text"
            placeholder="닉네임을 입력해주세요."
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>

        <div className={styles.profile__birth}>
          <label htmlFor="birth">생년월일</label>
          <input
            id="birth"
            type="text"
            placeholder="생년월일 8자리를 입력해주세요. (예: 20010227)"
            value={birth}
            onChange={(e) => setBirth(e.target.value)}
          />
        </div>

        <div className={styles.profile__sex}>
          <label htmlFor="sex">성별</label>
          <select id="sex" value={gender} onChange={(e) => setGender(e.target.value as Gender)}>
            <option value="" disabled>
              성별을 선택해주세요.
            </option>
            <option value={GenderEnum.MALE}>남성</option>
            <option value={GenderEnum.FEMALE}>여성</option>
            <option value={GenderEnum.PREFER_NOT_TO_SAY}>선택 안 함</option>
          </select>
        </div>
      </div>
      <div style={{ margin: "64px 10px 0 10px" }}>
        <BlockToggleBtn onClick={submit} isToggled={!!nickname && !!birth && !!gender}>
          가입 완료
        </BlockToggleBtn>
      </div>
    </div>
  );
};

export default SignupProfileScreen;
