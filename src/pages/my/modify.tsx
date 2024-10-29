import Head from "next/head";
import { useEffect, useState } from "react";

import { getMyInfoApi } from "@/services/myInfo";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import MyModifyForm from "@/containers/my/modify/my-modify-form";
import MyModifyProfileImage from "@/containers/my/modify/my-modify-profile-image";

import { MyInfo } from "@/types/myInfo";

const roleDisplay = {
  MENTO: "멘토",
  MENTEE: "멘티",
};

export default function MyModifyPage() {
  const [myInfo, setMyInfo] = useState<MyInfo>(null);

  useEffect(() => {
    const fetchMyData = async () => {
      await getMyInfoApi()
        .then((res) => {
          setMyInfo(res.data);
        })
        .catch((err) => {
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
        });
    };
    fetchMyData();
  }, []);

  if (!myInfo) {
    return null;
  }

  return (
    <>
      <Head>
        <title>프로필 수정</title>
      </Head>
      <TopDetailNavigation title="프로필 수정" />
      <div>
        <div className="flex flex-col items-center gap-3 pb-8 pt-10">
          <div className="font-serif text-xl font-semibold text-black">
            {myInfo.role ? roleDisplay[myInfo.role] : "멘티"}
          </div>
          <MyModifyProfileImage myInfo={myInfo} />
        </div>
        <MyModifyForm myInfo={myInfo} />
      </div>
    </>
  );
}
