import { afterEach, beforeEach, vi } from "vitest";

beforeEach(() => {
  window.sessionStorage.clear();
});

afterEach(() => {
  vi.clearAllMocks();
  window.sessionStorage.clear();
});
