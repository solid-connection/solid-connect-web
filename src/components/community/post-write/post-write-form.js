import styles from "./post-write-form.module.css";

export default function PostWriteForm(props) {
  return (
    <div className={styles.form}>
      <div className={styles.title}>
        <input type="text" placeholder="제목을 입력하세요" />
      </div>
      <div className={styles.content}>
        <textarea placeholder="내용을 입력하세요" />
      </div>
    </div>
  );
}
