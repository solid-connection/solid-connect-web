import Head from "next/head";
import { useEffect, useState } from "react";

import { getMyWishUniversityApi } from "@/services/myInfo";

import CollegeCards from "@/components/college/list/college-cards";
import TopDetailNavigation from "@/components/layout/TopDetailNavigation";
import ScrollTab from "@/components/ui/scroll-tab";

import { ListUniversity } from "@/types/university";

export default function MyScrapPage() {
  const [wishColleges, setWishColleges] = useState<ListUniversity[]>(null);

  useEffect(() => {
    const fetchWishColleges = async () => {
      await getMyWishUniversityApi()
        .then((res) => {
          setWishColleges(res.data);
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
    fetchWishColleges();
  }, []);

  // const tabs = ["스크랩 한 글", "멘토", "위시학교"];
  const tabs = ["위시학교"];
  const [tab, setTab] = useState(tabs[0]);

  if (!wishColleges) {
    return null;
  }

  return (
    <>
      <Head>
        <title>즐거찾기</title>
      </Head>
      <TopDetailNavigation title="즐거찾기" />
      <ScrollTab choices={tabs} choice={tab} setChoice={setTab} />
      {(() => {
        switch (tab) {
          case tabs[0]:
            return (
              <div className="mt-5">
                <CollegeCards colleges={wishColleges} />
              </div>
            );
          // case tabs[1]:
          // return <PostCards posts={posts} />;
          // case tabs[2]:
          // return <></>;
          default:
            return null;
        }
      })()}
    </>
  );
}
