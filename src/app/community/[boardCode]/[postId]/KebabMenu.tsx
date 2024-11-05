import { useRouter } from "next/navigation";
import { useState } from "react";

import { deletePostApi } from "@/services/community";

import Dropdown from "@/components/ui/dropdown";

import { IconMoreVertFilled } from "@/public/svgs";

type KebabMenuProps = {
  boardCode: string;
  postId: number;
};

const KebabMenu = ({ boardCode, postId }: KebabMenuProps) => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDeletePost = () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    deletePostApi(boardCode, postId)
      .then(() => {
        alert("게시글이 삭제되었습니다.");
        router.push(`/community/${boardCode}`);
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

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const dropdownItems = [
    {
      label: "수정하기",
      action: () => {
        router.push(`/community/${boardCode}/${postId}/modify`);
      },
    },
    {
      label: "삭제하기",
      action: toggleDeletePost,
    },
  ];

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <button onClick={toggleDropdown} type="button" aria-label="더보기">
        <IconMoreVertFilled />
      </button>
      {isDropdownOpen && <Dropdown options={dropdownItems} />}
    </div>
  );
};

export default KebabMenu;
