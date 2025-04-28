"use client";

import { useEffect, useState } from "react";

import { getMyWishUniversityApi } from "@/services/myInfo";

import UniversityCards from "@/components/college/UniversityCards";
import ScrollTab from "@/components/ui/ScrollTab";

import { ListUniversity } from "@/types/university";

const FavoriteContent = () => {
  const [wishColleges, setWishColleges] = useState<ListUniversity[] | null>(null);

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

  const tabs = ["위시학교"];
  const [tab, setTab] = useState(tabs[0]);

  if (!wishColleges) {
    return null;
  }

  return (
    <>
      <ScrollTab choices={tabs} choice={tab} setChoice={setTab} />
      {(() => {
        switch (tab) {
          case tabs[0]:
            return (
              <div className="mt-5">
                <UniversityCards colleges={wishColleges} />
              </div>
            );
          default:
            return null;
        }
      })()}
    </>
  );
};

export default FavoriteContent;
