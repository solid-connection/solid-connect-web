"use client";

import { useEffect, useState } from "react";

import { getMyInfoApi } from "@/services/myInfo";

import { MyInfo } from "@/types/myInfo";

import MyInfoModifyForm from "@/app/my/modify/MyInfoModifyForm";
import MyProfileImageModify from "@/app/my/modify/MyProfileImageModify";

const roleDisplay = {
  MENTO: "멘토",
  MENTEE: "멘티",
};

const ModifyContent = () => {
  const [myInfo, setMyInfo] = useState<MyInfo | null>(null);

  useEffect(() => {
    const fetchMyData = async () => {
      try {
        const res = await getMyInfoApi();
        setMyInfo(res.data);
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
    fetchMyData();
  }, []);

  if (!myInfo) {
    return null;
  }

  return (
    <div>
      <div className="flex flex-col items-center gap-3 pb-8 pt-10">
        <div className="font-serif text-xl font-semibold text-black">
          {myInfo.role ? roleDisplay[myInfo.role] : "멘티"}
        </div>
        <MyProfileImageModify myInfo={myInfo} />
      </div>
      <MyInfoModifyForm myInfo={myInfo} />
    </div>
  );
};

export default ModifyContent;
