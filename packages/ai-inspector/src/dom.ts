import type { ElementSelection, HoverRect } from "./types";

export const DEFAULT_INSPECTOR_UI_SELECTOR = "[data-ai-inspector-ui='true']";

const toTextSnippet = (target: HTMLElement): string => {
  const text = (target.innerText || target.textContent || "").replace(/\s+/g, " ").trim();
  return text.slice(0, 140);
};

const toClassName = (target: HTMLElement): string => {
  if (typeof target.className === "string") {
    return target.className;
  }

  return target.getAttribute("class") ?? "";
};

const toSelector = (target: HTMLElement, maxDepth = 6): string => {
  if (target.id) {
    return `#${target.id}`;
  }

  const segments: string[] = [];
  let current: HTMLElement | null = target;
  let depth = 0;

  while (current && depth < maxDepth) {
    const parent: HTMLElement | null = current.parentElement;
    const tag = current.tagName.toLowerCase();

    if (!parent) {
      segments.unshift(tag);
      break;
    }

    const sameTagSiblings = Array.from(parent.children).filter((child: Element) => child.tagName.toLowerCase() === tag);
    const index = sameTagSiblings.indexOf(current as Element) + 1;
    segments.unshift(`${tag}:nth-of-type(${index})`);

    current = parent;
    depth += 1;
  }

  return segments.join(" > ");
};

export const toHoverRect = (target: HTMLElement): HoverRect => {
  const rect = target.getBoundingClientRect();
  return {
    x: rect.left,
    y: rect.top,
    width: rect.width,
    height: rect.height,
  };
};

export const toElementSelection = (target: HTMLElement, maxSelectorDepth = 6): ElementSelection => {
  return {
    selector: toSelector(target, maxSelectorDepth),
    tagName: target.tagName.toLowerCase(),
    className: toClassName(target),
    textSnippet: toTextSnippet(target),
    rect: toHoverRect(target),
  };
};
