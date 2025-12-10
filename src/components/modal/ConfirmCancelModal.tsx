import ModalBase from "./ModalBase";

type ConfirmCancelModalProps = {
  isOpen: boolean;
  title: string;
  content: string;
  handleConfirm: () => void;
  handleCancel: () => void;
  cancelText?: string;
  approveText?: string;
};

const ConfirmCancelModal = ({
  isOpen,
  title,
  content,
  handleConfirm,
  handleCancel,
  cancelText = "취소",
  approveText = "확인",
}: ConfirmCancelModalProps) => {
  if (!isOpen) return null;

  return (
    <ModalBase isOpen={isOpen} onClose={handleCancel}>
      <div className="w-[20.5rem] rounded-xl bg-white px-5 py-[22px] shadow-sdwA">
        <div className="flex flex-col items-center gap-2">
          <span className="font-serif typo-bold-4 text-gray-900">{title}</span>
          <span className="whitespace-pre-wrap text-center font-serif typo-regular-1 text-gray-300">
            {content}
          </span>
        </div>
        <div className="mt-5 flex items-center justify-center gap-1">
          <button
            className="flex h-11 w-36 cursor-pointer items-center justify-center rounded-lg border border-bg-900 bg-white px-1.5 py-2"
            onClick={handleCancel}
            type="button"
          >
            <span className="text-center font-serif typo-regular-1 text-gray-700">{cancelText}</span>
          </button>
          <button
            className="flex h-11 w-36 cursor-pointer items-center justify-center rounded-lg bg-secondary px-1.5 py-2"
            onClick={handleConfirm}
            type="button"
          >
            <span className="text-center font-serif typo-regular-1 text-white">{approveText}</span>
          </button>
        </div>
      </div>
    </ModalBase>
  );
};

export default ConfirmCancelModal;
