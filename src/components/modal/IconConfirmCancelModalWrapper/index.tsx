import React, { useState } from "react";

import IconConfirmCancelModal from "@/components/modal/IconConfirmCancelModal";

interface IconConfirmCancelModalWrapperProps {
  children: React.ReactNode;
  icon: React.ReactNode;
  title: string;
  content: string;
  cancelText?: string;
  approveText?: string;
  disabled?: boolean;
}

const IconConfirmCancelModalWrapper: React.FC<IconConfirmCancelModalWrapperProps> = ({
  children,
  icon,
  title,
  content,
  cancelText = "홈으로",
  approveText = "다른 멘토 찾기",
  disabled = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <div onClick={() => !disabled && setIsModalOpen(true)}>{children}</div>
      <IconConfirmCancelModal
        icon={icon}
        isOpen={isModalOpen}
        title={title}
        content={content}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => setIsModalOpen(false)}
        rejectMessage={cancelText}
        approveMessage={approveText}
      />
    </>
  );
};

export default IconConfirmCancelModalWrapper;
