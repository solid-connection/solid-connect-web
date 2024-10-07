import styles from "./text-modal.module.css";

type TextModalProps = {
  show: boolean;
  handleCancel: () => void;
  handleConfirm: () => void;
  title: string;
  content: string;
};

export default function TextModal({ show, handleCancel, handleConfirm, title, content }: TextModalProps) {
  if (!show) return null;

  return (
    /* eslint-disable */
    <div className={styles.modalBackgorund} onClick={handleCancel}>
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalText}>
          <div className={styles.modalTitle}>{title}</div>
          <div style={{ whiteSpace: "pre-wrap" }} className={styles.modalContent}>
            {content}
          </div>
        </div>
        <div className={styles.modalButtons}>
          <button className={styles.modalButtonWhite} onClick={handleCancel} type="button">
            취소
          </button>
          <button className={styles.modalButtonBlack} onClick={handleConfirm} type="button">
            확인
          </button>
        </div>
      </div>
    </div>
    /* eslint-enable */
  );
}
