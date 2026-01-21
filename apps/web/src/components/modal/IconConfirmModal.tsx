import React, { ComponentType, SVGProps } from "react";

import ModalBase from "./ModalBase";

type IconConfirmModalProps = {
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  isOpen: boolean;
  title: string;
  content: string;
  onConfirm: () => void;
  onClose: () => void;
  approveMessage?: string; // default "확인"
  rejectMessage?: string; // default "취소"
};

const IconConfirmModal = ({
  icon,
  isOpen,
  title,
  content,
  onConfirm,
  onClose,
  approveMessage = "확인",
  rejectMessage = "취소",
}: IconConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <ModalBase isOpen={isOpen} onClose={onClose}>
      <div className="flex w-full flex-col items-center">
        <div className="rounded-xl bg-white px-5 py-6 shadow-sdwA">
          {icon && (
            <div className="mb-4 flex w-full justify-center">
              <div className="h-[60px] w-[60px]">{React.createElement(icon, { className: "h-full w-full" })}</div>
            </div>
          )}
          <div className="flex flex-col items-center gap-2">
            <span className="font-serif text-k-900 typo-sb-5">{title}</span>
            <span className="whitespace-pre-wrap text-center font-serif text-k-500 typo-regular-2">{content}</span>
          </div>
          <div className="mt-5 flex items-center justify-center gap-2">
            <button
              className="flex h-11 w-36 items-center justify-center rounded-3xl border border-k-200 px-1.5 py-2"
              onClick={onClose}
              type="button"
            >
              <span className="text-center font-serif text-k-500 typo-regular-1">{rejectMessage}</span>
            </button>
            <button
              className="flex h-11 w-36 items-center justify-center rounded-3xl bg-primary px-1.5 py-2"
              onClick={onConfirm}
              type="button"
            >
              <span className="text-center font-serif text-white typo-regular-1">{approveMessage}</span>
            </button>
          </div>
        </div>
      </div>
    </ModalBase>
  );
};

export default IconConfirmModal;
