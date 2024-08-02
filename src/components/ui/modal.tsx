import styles from "./modal.module.css";

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles["modal-overlay"]} onClick={handleOverlayClick}>
      <div className={styles["modal-content"]} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
