import { useRouter } from "next/router";
import { useRef, useState } from "react";

import { updateMyProfileImage } from "@/services/myInfo";

import { IconNoProfileImage, IconSignupProfileImage } from "../../../public/svgs";
import BlockBtn from "../ui/block-btn";
import styles from "./my-modify.module.css";

import { MAX_WIDTH } from "@/constants/meta";
import { MyInfo } from "@/types/myInfo";

type MyModifyProps = {
  myInfo: MyInfo;
};

export default function MyModify({ myInfo }: MyModifyProps) {
  const fileInputRef = useRef(null);
  const [nickname, setNickname] = useState<string>(myInfo.nickname);
  const router = useRouter();

  const updateProfileImage = async (imageFile: File) => {
    try {
      const res = await updateMyProfileImage(imageFile);
      alert("프로필 이미지가 변경되었습니다");
      router.reload();
    } catch (err) {
      if (err.response) {
        console.error("Axios response error", err.response);
        if (err.response.status === 401 || err.response.status === 403) {
          alert("로그인이 필요합니다");
          document.location.href = "/login";
        } else {
          alert(err.response.data?.message);
        }
      } else {
        console.error("Error", err.message);
        alert(err.message);
      }
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    updateProfileImage(file);
  };

  const roleDisplay = {
    MENTO: "멘토",
    MENTEE: "멘티",
  };
  return (
    <div>
      <div className={styles.profile}>
        <div className={styles.role}>{myInfo.role ? roleDisplay[myInfo.role] : "멘티"}</div>
        <div className={styles["profile-image-wrapper"]}>
          <div
            className={styles["profile-image"]}
            onClick={() => {
              fileInputRef.current.click();
            }}
          >
            {myInfo.profileImageUrl ? <img src={myInfo.profileImageUrl} alt="프로필 이미지" /> : <IconNoProfileImage />}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
          </div>
        </div>
      </div>

      <div className={styles.form}>
        <div className={styles.form__element}>
          <div>이름</div>
          <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} />
        </div>
        {/* <div className={styles.form__element}>
          <div>성별</div>
          <div>{gender || "미상"}</div>
        </div> */}
        <div className={styles.form__element}>
          <div>생년월일</div>
          <div>{myInfo.birth || "1970. 01. 01"}</div>
        </div>
        <div className={styles.form__element}>
          <div>출신학교</div>
          <div>{"인하대학교"}</div>
        </div>
        <div className={styles.form__element}>
          <div>파견학교</div>
          <div>{"미상"}</div>
        </div>
      </div>

      <BlockBtn
        style={{
          position: "fixed",
          bottom: "86px",
          width: "calc(100% - 60px)",
          maxWidth: MAX_WIDTH - 60,
          marginLeft: "30px",
        }}
        onClick={() => {}}
      >
        수정하기
      </BlockBtn>
    </div>
  );
}
