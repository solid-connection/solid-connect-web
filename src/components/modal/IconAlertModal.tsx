import Image from "next/image";
import React from "react";

import ModalBase from "./ModalBase";

type IconAlertModalProps = {
  icon?: React.ReactNode | string;
  isOpen: boolean;
  title: string;
  content: string;
  onAcknowledge: () => void;
  onClose: () => void;
  buttonText?: string; // default "확인"
};

const IconAlertModal = ({
  icon,
  isOpen,
  title,
  content,
  onAcknowledge,
  onClose,
  buttonText = "확인",
}: IconAlertModalProps) => {
  if (!isOpen) return null;

  return (
    <ModalBase isOpen={isOpen} onClose={onClose}>
      <div className="flex w-full flex-col items-center">
        <div className="rounded-xl bg-white px-5 py-6 shadow-sdwA">
          {icon && (
            <div className="mb-4 flex w-full justify-center">
              <div className="h-[60px] w-[60px]">
                {typeof icon === "string" ? (
                  <Image
                    src={icon.startsWith("/") ? icon : `/assets/${icon}`}
                    alt="icon"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  icon
                )}
              </div>
            </div>
          )}
          <div className="flex flex-col items-center gap-2">
            <span className="font-serif text-[18px] font-semibold leading-5 text-k-900">{title}</span>
            <span className="whitespace-pre-wrap text-center font-serif text-sm font-normal leading-6 text-k-500">
              {content}
            </span>
          </div>
          <div className="mt-5 flex items-center justify-center">
            <button
              className="flex h-11 w-36 items-center justify-center rounded-3xl bg-primary px-1.5 py-2"
              onClick={onAcknowledge}
              type="button"
            >
              <span className="text-center font-serif text-base font-normal leading-4 text-white">{buttonText}</span>
            </button>
          </div>
        </div>
      </div>
    </ModalBase>
  );
};

export default IconAlertModal;
