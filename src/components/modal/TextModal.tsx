import ModalBase from "./ModalBase";

type TextModalProps = {
  isOpen: boolean;
  handleClose: () => void;
  title: string;
  content: string;
  buttonContent?: string;
};

const TextModal = ({ isOpen, handleClose, title, content, buttonContent }: TextModalProps) => {
  if (!isOpen) return null;

  return (
    <ModalBase isOpen={isOpen} onClose={handleClose}>
      <div className="w-[20.5rem] rounded bg-white px-5 py-[22px]">
        <div className="flex flex-col items-center gap-2">
          <span className="font-serif text-base font-bold leading-5 text-[#121212]">{title}</span>
          <span className="whitespace-pre-wrap text-center font-serif font-normal leading-6 text-[#121212]">
            {content}
          </span>
        </div>
        <div className="mt-5 flex flex-col items-center">
          <button
            className="flex h-11 w-36 cursor-pointer items-center justify-center rounded-lg bg-primary-2 px-1.5 py-2"
            onClick={handleClose}
            type="button"
          >
            <span className="text-center font-serif text-base font-normal leading-4 text-white">
              {buttonContent || "확인"}
            </span>
          </button>
        </div>
      </div>
    </ModalBase>
  );
};

export default TextModal;
