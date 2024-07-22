import PencilWrite from "../ui/icon/PencilWrite";
import styles from "./post-write-button.module.css";

export default function PostWriteButton(props) {
  const { onClick } = props;
  return (
    <div className={styles.buttonWrapper}>
      <div className={styles.button} onClick={onClick}>
        <div className={styles.icon}>
          <PencilWrite />
        </div>
      </div>
    </div>
  );
}
