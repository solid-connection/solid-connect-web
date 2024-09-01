import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { deletePostApi, getPostDetailApi } from "@/services/community";

import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import Dropdown from "@/components/ui/dropdown";
import CommentWrite from "@/containers/community/post/comment-write";
import Comments from "@/containers/community/post/comments";
import Post from "@/containers/community/post/post";

import { IconMoreVertFilled } from "../../../../../public/svgs";

import { Post as PostType } from "@/types/community";

export default function PostPage({ boardCode, postId }: { boardCode: string | any; postId: number | any }) {
  const router = useRouter();
  const [post, setPost] = useState<PostType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [curSelectedComment, setCurSelectedComment] = useState<number | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      await getPostDetailApi(boardCode, postId)
        .then((res) => {
          setPost(res.data);
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
      setIsLoading(false);
    };
    fetchPosts();
  }, []);

  if (isLoading) {
    return (
      <>
        <Head>
          <title>커뮤니티</title>
        </Head>
        <TopDetailNavigation
          title=""
          handleBack={() => {
            router.push(`/community/${boardCode}`);
          }}
        />
        <div>
          <Post post={null} boardCode={boardCode} postId={postId} />
          <Comments
            comments={[]}
            postId={postId}
            refresh={() => {
              router.reload();
            }}
            setCurSelectedComment={setCurSelectedComment}
          />
          <CommentWrite
            postId={postId}
            refresh={() => {
              router.reload();
            }}
            curSelectedComment={curSelectedComment}
            setCurSelectedComment={setCurSelectedComment}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>
      <TopDetailNavigation
        title={post.postFindBoardResponse.koreanName}
        handleBack={() => {
          router.push(`/community/${boardCode}`);
        }}
        icon={post.isOwner && <KebabMenu boardCode={boardCode} postId={postId} router={router} />}
      />
      <div>
        <Post post={post} boardCode={boardCode} postId={postId} />
        <Comments
          comments={post.postFindCommentResponses}
          postId={postId}
          refresh={() => {
            router.reload();
          }}
          setCurSelectedComment={setCurSelectedComment}
        />
        <CommentWrite
          postId={postId}
          refresh={() => {
            router.reload();
          }}
          curSelectedComment={curSelectedComment}
          setCurSelectedComment={setCurSelectedComment}
        />
      </div>
    </>
  );
}

type KebabMenuProps = {
  boardCode: string;
  postId: number;
  router: any;
};

function KebabMenu({ boardCode, postId, router }: KebabMenuProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDeletePost = () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

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
      <div onClick={toggleDropdown}>
        <IconMoreVertFilled />
      </div>
      {isDropdownOpen && <Dropdown options={dropdownItems} />}
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const { boardCode, postId }: { boardCode: string; postId: number } = params;
  return {
    props: {
      boardCode,
      postId,
    },
  };
}
