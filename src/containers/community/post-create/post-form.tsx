import { useEffect, useRef } from "react";

import CheckBoxOutlineBlankOutlined from "@/components/ui/icon/CheckBoxOutlineBlankOutlined";

import styles from "./post-form.module.css";

export default function PostForm(props) {
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      const adjustHeight = () => {
        textarea.style.height = "auto";
        textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`;
      };

      textarea.addEventListener("input", adjustHeight);
      return () => textarea.removeEventListener("input", adjustHeight);
    }
  }, []);

  const notice =
    "글 작성 시 유의사항\n\n인종, 성별, 출신, 지역, 이념 관련 차별 관련 발언 및 타인에게 불쾌감을 유발할 수 있는 글은 삭제될 수 있습니다.\n\n솔리드 커넥션은 홍보 행위를 철저히 금지합니다.";
  return (
    <div className={styles.form}>
      <div className={styles.title}>
        <textarea placeholder="제목을 입력하세요" maxLength={40} rows={2}></textarea>
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
