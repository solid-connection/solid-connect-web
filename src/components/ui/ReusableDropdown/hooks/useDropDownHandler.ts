import { useEffect, useRef, useState } from "react";

import { DropdownItem } from "../";

const useDropDownHandler = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dropdownPosition, setDropdownPosition] = useState<"left" | "right">("left");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (item: DropdownItem) => {
    onSelect(item.value);
    setIsOpen(false);
  };

  // 우측에 위치할경우 드롭다운 위치 조정
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const dropdownWidth = 200;
      setDropdownPosition(rect.right + dropdownWidth > viewportWidth ? "right" : "left");
    }
  }, [isOpen]);

  return {
    isOpen,
    toggleDropdown,
    handleSelect,
    dropdownPosition,
    dropdownRef,
  };
};
export default useDropDownHandler;
