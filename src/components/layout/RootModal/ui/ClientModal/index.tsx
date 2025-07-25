import IconConfirmModal from "@/components/modal/IconConfirmModal";

import { useConfirmModalStore } from "@/lib/zustand/useConfirmModalStore";

const ClientModal = () => {
  const { isOpen, payload, confirm, reject } = useConfirmModalStore();

  return (
    <>
      <IconConfirmModal
        isOpen={isOpen}
        title={payload?.title || "확인"}
        content={payload?.content || "정말로 이 작업을 진행하시겠습니까?"}
        icon={payload?.icon}
        buttonText={payload?.buttonText}
        onConfirm={confirm}
        onClose={reject}
      />
    </>
  );
};
export default ClientModal;
