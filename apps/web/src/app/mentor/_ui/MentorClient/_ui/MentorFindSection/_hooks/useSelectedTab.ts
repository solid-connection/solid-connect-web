import { type RefObject, useRef, useState } from "react";

import { FilterTab } from "@/types/mentor";

interface UseSelectedTabReturn {
  listRef: RefObject<HTMLDivElement>;
  selectedTab: FilterTab;
  handleSelectTab: (tab: FilterTab) => void;
}

const useSelectedTab = (): UseSelectedTabReturn => {
  const [selectedTab, setSelectedTab] = useState<FilterTab>(FilterTab.ALL);
  const listRef = useRef<HTMLDivElement>(null);

  const handleSelectTab = (tab: FilterTab) => {
    setSelectedTab(tab);
    if (listRef.current) {
      listRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return { listRef, selectedTab, handleSelectTab };
};
export default useSelectedTab;
