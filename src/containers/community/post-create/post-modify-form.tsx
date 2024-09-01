import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import { updatePostApi } from "@/services/community";

import ArrowBackFilled from "@/components/ui/icon/ArrowBackFilled";

import { IconImage, IconPosstCheckboxOutlined, IconPostCheckboxFilled } from "../../../../public/svgs";
import navStyles from "../../../components/layout/top-detail-navigation.module.css";
import styles from "./post-form.module.css";

type PostModifyFormProps = {
  boardCode: string;
  postId: number;
  defaultTitle: string;
  defaultContent: string;
  defaultIsQuestion: boolean;
  defaultPostCategory: string;
};

export default function PostModifyForm({
  boardCode,
  postId,
  defaultTitle,
  defaultContent,
  defaultIsQuestion,
  defaultPostCategory,
}: PostModifyFormProps) {
  const [title, setTitle] = useState(defaultTitle);
  const [content, setContent] = useState(defaultContent);
  const textareaRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const imageUploadRef = useRef(null);
  const router = useRouter();

  const routeBack = () => {
    router.back(); // 라우터의 back 함수를 사용하여 이전 페이지로 이동
  };

  useEffect(() => {
    const textarea = textareaRef.current;

    const adjustHeight = () => {
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      const newHeight = scrollHeight <= 50 ? 50 : Math.min(scrollHeight, 100);
      textarea.style.height = `${newHeight}px`;
    };

    textarea.addEventListener("input", adjustHeight);

    // 초기 높이 설정
    adjustHeight();

    return () => textarea.removeEventListener("input", adjustHeight);
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  const submitPost = async () => {
    try {
      const res = await updatePostApi(boardCode, postId, {
        postUpdateRequest: {
          postCategory: defaultPostCategory,
          title: title,
          content: content,
        },
        file: [...imageUploadRef.current.files],
      });
      router.push(`/community/${boardCode}/${postId}`);
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

  const notice =
    "글 작성 시 유의사항\n\n인종, 성별, 출신, 지역, 이념 관련 차별 관련 발언 및 타인에게 불쾌감을 유발할 수 있는 글은 삭제될 수 있습니다.\n\n솔리드 커넥션은 홍보 행위를 철저히 금지합니다.";

  return (
    <>
      <CustomTopDetailNavigation routeBack={routeBack} submitPost={submitPost} />
      <div className={styles.form}>
        <div className={styles.title} ref={titleRef}>
          <textarea
            placeholder="제목을 입력하세요"
            maxLength={40}
            rows={1}
            ref={textareaRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
          ></textarea>
        </div>
        <div className={styles["second-row"]}>
          <div className={styles.question}>
            <button>{defaultIsQuestion ? <IconPostCheckboxFilled /> : <IconPosstCheckboxOutlined />}</button>
            질문으로 업로드 하기
          </div>
          <div className={styles["image-upload"]}>
            <button
              className={styles["image-upload__button"]}
              onClick={() => {
                imageUploadRef.current.click();
              }}
            >
              <IconImage />
            </button>
            <input
              className={styles["image-upload__input"]}
              ref={imageUploadRef}
              type="file"
              accept="image/*"
              multiple
            />
          </div>
        </div>
        <div className={styles.content}>
          <textarea
            ref={textareaRef}
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className={styles.notice} dangerouslySetInnerHTML={{ __html: notice.replace(/\n/g, "<br />") }}></div>
      </div>
    </>
  );
}

function CustomTopDetailNavigation({ routeBack, submitPost }) {
  return (
    <div className={navStyles.topNav}>
      <div className={navStyles.icon} onClick={routeBack}>
        <ArrowBackFilled />
      </div>
      <div className={navStyles.title}>글쓰기</div>
      <div className={navStyles.icon}>
        <button className={styles["submit-button"]} onClick={submitPost}>
          등록
        </button>
      </div>
    </div>
  );
}
