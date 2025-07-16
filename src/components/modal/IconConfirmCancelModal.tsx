import ModalBase from "./ModalBase";

type IconConfirmCancelModalProps = {
  icon?: React.ReactNode; // 아이콘 추가
  isOpen: boolean;
  title: string;
  content: string;
  handleConfirm: () => void;
  handleCancel: () => void;
  cancelText?: string;
  approveText?: string;
};

const IconConfirmCancelModal = ({
  icon,
  isOpen,
  title,
  content,
  handleConfirm,
  handleCancel,
  cancelText = "취소",
  approveText = "확인",
}: IconConfirmCancelModalProps) => {
  if (!isOpen) return null;

  return (
    <ModalBase isOpen={isOpen} onClose={handleCancel}>
      <div className="flex w-full flex-col items-center">
        <div className="rounded-xl bg-white px-5 py-6 shadow-sdwA">
          {icon && (
            <div className="mb-4 flex w-full justify-center">
              <div className="h-[60px] w-[60px]">{icon}</div>
            </div>
          )}
          <div className="flex flex-col items-center gap-2">
            <span className="font-serif text-[18px] font-semibold leading-5 text-k-900">{title}</span>
            <span className="whitespace-pre-wrap text-center font-serif text-sm font-normal leading-6 text-k-500">
              {content}
            </span>
          </div>
          <div className="mt-5 flex items-center justify-center gap-1">
            <button
              className="flex h-11 w-36 cursor-pointer items-center justify-center rounded-3xl border border-[#c2c2c2] bg-white px-1.5 py-2"
              onClick={handleCancel}
              type="button"
            >
              <span className="text-center font-serif text-base font-normal leading-4 text-[#3c3c3c]">
                {cancelText}
              </span>
            </button>
            <button
              className="flex h-11 w-36 cursor-pointer items-center justify-center rounded-3xl bg-primary px-1.5 py-2"
              onClick={handleConfirm}
              type="button"
            >
              <span className="text-center font-serif text-base font-normal leading-4 text-white">{approveText}</span>
            </button>
          </div>
        </div>
      </div>
    </ModalBase>
  );
};

export default IconConfirmCancelModal;
