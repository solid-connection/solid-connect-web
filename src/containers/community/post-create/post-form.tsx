import styles from "./post-form.module.css";

export default function PostForm(props) {
  const notice =
    "글 작성 시 유의사항!\n\n자유 게시판에서는 교환학생 기간 중 있었던 에피소드와 꿀팁들을 함께 공유할 수 있습니다.\n\n\n인종, 성별, 출신, 지역, 이념 관련 차별 관련 발언은 자동 삭제 조치됩니다. 타인에게 불쾌감을 유발할 수 있는 글은 삭제됩니다.\n솔리드 커넥션은 홍보 행위를 철저히 금지합니다.";
  return (
    <div className={styles.form}>
      <div className={styles.title}>
        <input type="text" placeholder="제목을 입력하세요" />
      </div>
      <div className={styles.inputs}>
        <></>
      </div>
      <div className={styles.content}>
        <textarea placeholder="내용을 입력하세요" />
      </div>
      <div className={styles.notice} dangerouslySetInnerHTML={{ __html: notice.replace(/\n/g, "<br />") }}></div>
    </div>
  );
}
