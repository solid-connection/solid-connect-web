import { useEffect, useRef, useState } from "react";

const useDropDownHandler = <T extends string | number>({ onSelect }: { onSelect: (value: T) => void }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dropdownPosition, setDropdownPosition] = useState<"left" | "right">("left");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const onSelectRef = useRef(onSelect);

  // onSelect 함수의 최신 참조를 유지
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (item: T) => {
    onSelectRef.current(item);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
