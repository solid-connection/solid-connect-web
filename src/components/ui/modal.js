import styles from "./modal.module.css";

export default function Modal(props) {
  const { show, handleCancel, handleConfirm, title, content } = props;

  if (!show) return null;

  return (
    <div className={styles.modalBackgorund} onClick={handleCancel}>
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalText}>
          <div className={styles.modalTitle}>{title}</div>
          <div style={{ whiteSpace: "pre-wrap" }} className={styles.modalContent}>
            {content}
          </div>
        </div>
        <div className={styles.modalButtons}>
          <button className={styles.modalButtonWhite} onClick={handleCancel}>
            취소
          </button>
          <button className={styles.modalButtonBlack} onClick={handleConfirm}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
