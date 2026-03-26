import { useEffect, useState } from "react";
import { DEFAULT_INSPECTOR_UI_SELECTOR, toElementSelection, toHoverRect } from "./dom";
import type { ElementSelection, HoverRect } from "./types";

interface UseAiInspectorSelectionOptions {
  isEnabled?: boolean;
  uiSelector?: string;
  maxSelectorDepth?: number;
  shouldIgnoreTarget?: (target: HTMLElement) => boolean;
}

interface UseAiInspectorSelectionResult {
  isInspecting: boolean;
  hoverRect: HoverRect | null;
  selection: ElementSelection | null;
  setIsInspecting: (next: boolean | ((prev: boolean) => boolean)) => void;
  setSelection: (next: ElementSelection | null) => void;
  clearSelection: () => void;
  resetInspector: () => void;
}

export const useAiInspectorSelection = (
  options: UseAiInspectorSelectionOptions = {},
): UseAiInspectorSelectionResult => {
  const {
    isEnabled = true,
    uiSelector = DEFAULT_INSPECTOR_UI_SELECTOR,
    maxSelectorDepth = 6,
    shouldIgnoreTarget,
  } = options;
  const [isInspecting, setIsInspecting] = useState(false);
  const [hoverRect, setHoverRect] = useState<HoverRect | null>(null);
  const [selection, setSelection] = useState<ElementSelection | null>(null);

  useEffect(() => {
    if (!isEnabled) {
      setIsInspecting(false);
      setHoverRect(null);
      setSelection(null);
    }
  }, [isEnabled]);

  useEffect(() => {
    if (!isEnabled || !isInspecting) {
      setHoverRect(null);
      return;
    }

    const isIgnoredTarget = (target: HTMLElement) => {
      if (target.closest(uiSelector)) {
        return true;
      }

      if (shouldIgnoreTarget?.(target)) {
        return true;
      }

      return false;
    };

    const handleMouseMove = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }

      if (isIgnoredTarget(target)) {
        setHoverRect(null);
        return;
      }

      setHoverRect(toHoverRect(target));
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }

      if (isIgnoredTarget(target)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      setSelection(toElementSelection(target, maxSelectorDepth));
      setIsInspecting(false);
      setHoverRect(null);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsInspecting(false);
      }
    };

    document.addEventListener("mousemove", handleMouseMove, true);
    document.addEventListener("click", handleClick, true);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove, true);
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEnabled, isInspecting, maxSelectorDepth, shouldIgnoreTarget, uiSelector]);

  const clearSelection = () => {
    setSelection(null);
    setHoverRect(null);
  };

  const resetInspector = () => {
    setIsInspecting(false);
    clearSelection();
  };

  return {
    isInspecting,
    hoverRect,
    selection,
    setIsInspecting,
    setSelection,
    clearSelection,
    resetInspector,
  };
};
