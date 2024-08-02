import { useEffect, useRef } from "react";

import CheckBoxOutlineBlankOutlined from "@/components/ui/icon/CheckBoxOutlineBlankOutlined";

import styles from "./post-form.module.css";

export default function PostForm(props) {
  const textareaRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    const title = titleRef.current;

    const adjustHeight = () => {
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      const newHeight = scrollHeight <= 50 ? 50 : Math.min(scrollHeight, 100);
      textarea.style.height = `${newHeight}px`;
      title.style.height = `${newHeight}px`;
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

  const notice =
    "글 작성 시 유의사항\n\n인종, 성별, 출신, 지역, 이념 관련 차별 관련 발언 및 타인에게 불쾌감을 유발할 수 있는 글은 삭제될 수 있습니다.\n\n솔리드 커넥션은 홍보 행위를 철저히 금지합니다.";
  return (
    <div className={styles.form}>
      <div className={styles.title} ref={titleRef}>
        <textarea
          placeholder="제목을 입력하세요"
          maxLength={40}
          rows={1}
          ref={textareaRef}
          onKeyDown={handleKeyDown}
        ></textarea>
      </div>
      <div className={styles.question}>
        <div className={styles.question__select}>
          <div className={styles.question__box}>
            <CheckBoxOutlineBlankOutlined size={18} />
          </div>
          질문으로 업로드 하기
        </div>
      </div>
      <div className={styles.content}>
        <textarea placeholder="내용을 입력하세요" />
      </div>
      <div className={styles.notice} dangerouslySetInnerHTML={{ __html: notice.replace(/\n/g, "<br />") }}></div>
    </div>
  );
}
