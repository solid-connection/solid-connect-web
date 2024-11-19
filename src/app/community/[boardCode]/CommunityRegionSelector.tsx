"use client";

import { useState } from "react";

import ModalBase from "@/components/modal/ModalBase";
import CheckBoxOutlineBlankOutlined from "@/components/ui/icon/CheckBoxOutlineBlankOutlined";

import styles from "./community-region-selector.module.css";

import { IconExpandMoreFilled } from "@/public/svgs/community";

type CommunityRegionSelectorProps = {
  curRegion: string;
  setCurRegion: React.Dispatch<React.SetStateAction<string>>;
  regionChoices: { code: string; nameKo: string }[];
};

const CommunityRegionSelector = ({ curRegion, setCurRegion, regionChoices }: CommunityRegionSelectorProps) => {
  const [isRegionSelectorModalVisible, setIsRegionSelectorModalVisible] = useState<boolean>(false);
  const toggleRegionSelectorModal = () => {
    setIsRegionSelectorModalVisible((prev) => !prev);
  };
  return (
    <>
      <div className={styles.header}>
        <button className={styles.title} onClick={toggleRegionSelectorModal} type="button">
          {curRegion}
        </button>
        <button className={styles.button} onClick={toggleRegionSelectorModal} type="button" aria-label="게시판 변경">
          <IconExpandMoreFilled />
        </button>
      </div>
      <ModalBase isOpen={isRegionSelectorModalVisible} onClose={toggleRegionSelectorModal}>
        <div className={styles.modal}>
          <div className={styles.modal__header}>권역 변경</div>
          <div className={styles.modal__category}>
            {regionChoices.map((region) => (
              <button
                className={styles.modal__element_wrapper}
                key={region.code}
                onClick={() => {
                  setCurRegion(region.code);
                  toggleRegionSelectorModal();
                }}
                type="button"
              >
                <CheckBoxOutlineBlankOutlined />
                <div className={styles.modal__element}>{region.nameKo}</div>
              </button>
            ))}
          </div>
        </div>
      </ModalBase>
    </>
  );
};

export default CommunityRegionSelector;
