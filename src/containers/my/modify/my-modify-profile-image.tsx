import { useRouter } from "next/router";
import { useRef } from "react";

import { updateMyNicknameApi, updateMyProfileImage } from "@/services/myInfo";

import { MyInfo } from "@/types/myInfo";

import { IconNoProfileImage } from "@/public/svgs";

type MyModifyProfileImageProps = {
  myInfo: MyInfo;
};

const MyModifyProfileImage = ({ myInfo }: MyModifyProfileImageProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleError = (error: any) => {
    if (error.response) {
      console.error("Axios response error", error.response);
      if (error.response.status === 401 || error.response.status === 403) {
        alert("로그인이 필요합니다");
        document.location.href = "/login";
      } else {
        alert(error.response.data?.message);
      }
    } else {
      console.error("Error", error.message);
      alert(error.message);
    }
  };

  const updateProfileImage = async (imageFile: File) => {
    try {
      await updateMyProfileImage(imageFile);
      alert("프로필 이미지가 변경되었습니다");
      router.reload();
    } catch (err) {
      handleError(err);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      updateProfileImage(file);
    }
  };

  return (
    <div
      className="h-[6.75rem] w-[6.75rem] hover:cursor-pointer"
      onClick={() => {
        fileInputRef.current.click();
      }}
    >
      {myInfo.profileImageUrl ? (
        <img
          className="h-[6.75rem] w-[6.75rem] rounded-full object-cover"
          src={myInfo.profileImageUrl}
          alt="프로필 이미지"
        />
      ) : (
        <IconNoProfileImage />
      )}
      <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleImageUpload} />
    </div>
  );
};

export default MyModifyProfileImage;
