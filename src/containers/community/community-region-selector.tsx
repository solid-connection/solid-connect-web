import { useState } from "react";

import CheckBoxOutlineBlankOutlined from "@/components/ui/icon/CheckBoxOutlineBlankOutlined";
import ExpendMoreFilled from "@/components/ui/icon/ExpendMoreFilled";
import Modal from "@/components/ui/modal";

import styles from "./community-region-selector.module.css";

export default function CommunityRegionSelector({ curRegion, setCurRegion, regionChoices }) {
  const [isRegionSelectorModalVisible, setIsRegionSelectorModalVisible] = useState<boolean>(false);
  const toggleRegionSelectorModal = () => {
    setIsRegionSelectorModalVisible((prev) => !prev);
  };
  return (
    <>
      <div className={styles.header}>
        <div className={styles.title} onClick={toggleRegionSelectorModal}>
          {curRegion}
        </div>
        <button className={styles.button} onClick={toggleRegionSelectorModal}>
          <ExpendMoreFilled />
        </button>
      </div>
      <Modal isOpen={isRegionSelectorModalVisible} onClose={toggleRegionSelectorModal}>
        <div className={styles.modal}>
          <div className={styles.modal__header}>권역 변경</div>
          <div className={styles.modal__category}>
            {regionChoices.map((region) => (
              <div
                className={styles.modal__element_wrapper}
                key={region.code}
                onClick={() => {
                  setCurRegion(region.code);
                  toggleRegionSelectorModal();
                }}
              >
                <CheckBoxOutlineBlankOutlined />
                <div className={styles.modal__element}>{region.nameKo}</div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
}
