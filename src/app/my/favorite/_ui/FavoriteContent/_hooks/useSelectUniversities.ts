import { useState } from "react";

import { QueryKeys } from "@/apis/queryKeys";
import { useDeleteWish } from "@/apis/universities";
import { toast } from "@/lib/zustand/useToastStore";
import { useQueryClient } from "@tanstack/react-query";

interface UseSelectUniversitiesReturn {
  editSelected: number[];
  handleEditSelected: (id: number) => void;
  handleDeleteAll: () => void;
}
const useSelectUniversities = (): UseSelectUniversitiesReturn => {
  const { mutate: deleteUserAccount } = useDeleteWish();

  const queryClient = useQueryClient();
  const [editSelected, setEditSelected] = useState<number[]>([]);

  const handleEditSelected = (id: number) => {
    if (editSelected.includes(id)) {
      setEditSelected(editSelected.filter((selectedId) => selectedId !== id));
    } else {
      setEditSelected([...editSelected, id]);
    }
  };
  const handleDeleteAll = () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    Promise.allSettled(
      editSelected.map(
        (id) =>
          new Promise<void>((resolve, reject) => {
            deleteUserAccount(id, {
              onSuccess: () => resolve(),
              onError: () => reject(new Error(`삭제 실패: ${id}`)),
            });
          }),
      ),
    ).then((results) => {
      const hasError = results.some((r) => r.status === "rejected");
      if (hasError) {
        toast.error("일부 학교 삭제에 실패했습니다.");
      } else {
        toast.success("모든 학교가 삭제되었습니다.");
      }
      queryClient.invalidateQueries({ queryKey: [QueryKeys.universities.wishList] });
    });
  };

  return {
    editSelected,
    handleEditSelected,
    handleDeleteAll,
  };
};

export default useSelectUniversities;
