import { useEffect, useRef, useState } from "react";
import { Control, FieldValues, useController } from "react-hook-form";

import { ChannelType } from "@/types/mentor";

interface useSelectHandlerReturn {
  isOpen: boolean;
  dropdownRef: React.RefObject<HTMLDivElement>;
  handleChannelChange: (val: string | null) => void;
  toggleDropdown: () => void;
}

interface UseSelectHandlerProps {
  name?: string;
  control: Control<FieldValues>;
  onChannelChange?: (val: string | null) => void;
}
const useSelectHandler = ({
  name = "channel",
  control,
  onChannelChange,
}: UseSelectHandlerProps): useSelectHandlerReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { field } = useController({ name, control, defaultValue: null });

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

  const handleChannelChange = (value: ChannelType | null) => {
    setIsOpen(false);
    field.onChange(value); // react‑hook‑form state
    onChannelChange?.(value); // 외부 콜백 호출
  };
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  return {
    isOpen,
    dropdownRef,
    handleChannelChange,
    toggleDropdown,
  };
};
export default useSelectHandler;
