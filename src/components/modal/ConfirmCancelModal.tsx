import ModalBase from "./ModalBase";

type ConfirmCancelModalProps = {
  isOpen: boolean;
  handleCancel: () => void;
  handleConfirm: () => void;
  title: string;
  content: string;
};

const ConfirmCancelModal = ({ isOpen, handleCancel, handleConfirm, title, content }: ConfirmCancelModalProps) => {
  if (!isOpen) return null;

  return (
    <ModalBase isOpen={isOpen} onClose={handleCancel}>
      <div className="w-[20.5rem] rounded bg-white px-5 py-[22px]">
        <div className="flex flex-col items-center gap-2">
          <span className="font-serif text-base font-bold leading-5 text-[#121212]">{title}</span>
          <span className="whitespace-pre-wrap text-center font-serif font-normal leading-6 text-[#7a7a7a]">
            {content}
          </span>
        </div>
        <div className="mt-5 flex items-center justify-center gap-1">
          <button
            className="flex h-11 w-36 cursor-pointer items-center justify-center rounded-lg border border-[#c2c2c2] bg-white px-1.5 py-2"
            onClick={handleCancel}
          >
            <span className="text-center font-serif text-base font-normal leading-4 text-[#3c3c3c]">취소</span>
          </button>
          <button
            className="flex h-11 w-36 cursor-pointer items-center justify-center rounded-lg bg-primary-2 px-1.5 py-2"
            onClick={handleConfirm}
          >
            <span className="text-center font-serif text-base font-normal leading-4 text-white">확인</span>
          </button>
        </div>
      </div>
    </ModalBase>
  );
};

export default ConfirmCancelModal;
