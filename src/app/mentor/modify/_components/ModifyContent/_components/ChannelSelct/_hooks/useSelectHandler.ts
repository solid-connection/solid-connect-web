import { useEffect, useRef, useState } from "react";

interface useSelectHandlerReturn {
  isOpen: boolean;
  selectedValue: string | null;
  dropdownRef: React.RefObject<HTMLDivElement>;
  handleChannelChange: (value: string | null) => void;
  toggleDropdown: () => void;
}

const useSelectHandler = (): useSelectHandlerReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleChannelChange = (value: string | null) => {
    setSelectedValue(value);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  return {
    isOpen,
    selectedValue,
    dropdownRef,
    handleChannelChange,
    toggleDropdown,
  };
};
export default useSelectHandler;
