import { useEffect, useRef, useState } from "react";

const useDropDownHandler = <T extends string | number>({ onSelect }: { onSelect: (value: T) => void }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dropdownPosition, setDropdownPosition] = useState<"left" | "right">("left");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (item: T) => {
    onSelect(item);
    setIsOpen(false);
  };

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
