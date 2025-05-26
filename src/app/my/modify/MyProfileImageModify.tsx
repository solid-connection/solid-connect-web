"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";

import { MyInfo } from "@/types/myInfo";

import { updateMyInfoApi } from "@/apis/myInfo";

type MyProfileImageModifyProps = {
  myInfo: MyInfo;
};

const MyProfileImageModify = ({ myInfo }: MyProfileImageModifyProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const updateProfileImage = async (imageFile: File) => {
    try {
      await updateMyInfoApi({ file: imageFile });
      alert("프로필 이미지가 변경되었습니다");
      router.refresh();
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
        fileInputRef.current?.click();
      }}
    >
      <img
        className="h-[6.75rem] w-[6.75rem] rounded-full object-cover"
        src={
          myInfo.profileImageUrl
            ? `${process.env.NEXT_PUBLIC_UPLOADED_IMAGE_URL}/${myInfo.profileImageUrl}`
            : "/images/placeholder/profile64.svg"
        }
        alt="프로필 이미지"
      />
      <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleImageUpload} />
    </div>
  );
};

export default MyProfileImageModify;
