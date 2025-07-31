import { useState } from "react";

import IconConfirmCancelModal from "@/components/modal/IconConfirmModal";

import { IconModify } from "@/public/svgs/mentor";

interface ModifyBtnPanelProps {
  onSubmit: () => void;
}

const ModifyBtnPanel = ({ onSubmit }: ModifyBtnPanelProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="mb-10 h-[40px] w-[150px] rounded-3xl bg-primary-1 px-5 py-[10px] text-k-0"
      >
        수정하기
      </button>
      <IconConfirmCancelModal
        isOpen={isModalOpen}
        icon={
          <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full border-[4px] border-primary-1 px-3 py-3">
            <IconModify />
          </div>
        }
        title="멘토 정보 수정"
        content="수정된 정보를 저장하시겠습니까?"
        isOneButton={false}
        cancelText="취소"
        approveText="저장"
        handleCancel={() => setIsModalOpen(false)}
        handleConfirm={() => {
          onSubmit();
          setIsModalOpen(false);
        }}
      />
    </>
  );
};

export default ModifyBtnPanel;
