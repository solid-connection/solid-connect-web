import { cleanup } from "@testing-library/react/pure";
import { afterEach, vi } from "vitest";

if (typeof document !== "undefined") {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
