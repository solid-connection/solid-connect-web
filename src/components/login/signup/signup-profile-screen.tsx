import { Dispatch, SetStateAction, useRef } from "react";

import BlockToggleBtn from "@/components/ui/block-toggle-btn";

import { IconSignupProfileImage } from "../../../../public/svgs";
import styles from "./signup.module.css";

type SignupProfileScreenProps = {
  toNextStage: () => void;
  nickname: string;
  setNickname: Dispatch<SetStateAction<string>>;
  genderRef: any;
  birthRef: any;
  defaultProfileImageUrl: string;
  imageFile: string;
  setImageFile: Dispatch<SetStateAction<any>>;
};

export default function SignupProfileScreen({
  toNextStage,
  nickname,
  setNickname,
  genderRef,
  birthRef,
  defaultProfileImageUrl,
  imageFile,
  setImageFile,
}: SignupProfileScreenProps) {
  const fileInputRef = useRef(null);

  const submit = () => {
    if (!nickname) {
      alert("닉네임을 입력해주세요.");
      return;
    }
    if (!birthRef.current.value) {
      alert("생년월일을 입력해주세요.");
      return;
    }
    if (!genderRef.current.value) {
      alert("성별을 선택해주세요.");
      return;
    }
    toNextStage();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const getImage = () => {
    if (imageFile) {
      return <img src={imageFile} alt="profile image" />;
    }
    if (defaultProfileImageUrl) {
      return <img src={defaultProfileImageUrl} alt="profile image" />;
    }
    return <IconSignupProfileImage />;
  };

  return (
    <div className={styles.screen}>
      <div className={styles["secondary-title"]}>가입 마지막 단계예요!</div>
      <div className={styles["title"]}>
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
          <input id="birth" type="text" placeholder="생년월일 8자리를 입력해주세요. (예: 20010227)" ref={birthRef} />
        </div>

        <div className={styles.profile__sex}>
          <label htmlFor="sex">성별</label>
          <select ref={genderRef} defaultValue={""}>
            <option value="" disabled>
              성별을 선택해주세요.
            </option>
            <option value="MALE">남성</option>
            <option value="FEMALE">여성</option>
            <option value="PREFER_NOT_TO_SAY">선택 안 함</option>
          </select>
        </div>
      </div>
      <div style={{ margin: "64px 10px 0 10px" }}>
        <BlockToggleBtn
          onClick={submit}
          isToggled={!!nickname && !!genderRef.current.value && !!birthRef.current.value}
        >
          가입 완료
        </BlockToggleBtn>
      </div>
    </div>
  );
}
