import { describe, expect, it } from "vitest";

// useDailyScrumProjectSheet.ts에 정의된 로직을 기반으로 검증
// 실제로는 해당 로직들이 util로 분리되어 있으면 더 좋음

const isProjectStepReady = (
  step: "tag" | "title" | "task",
  selectedTag: string | null,
  title: string,
  tasks: string[],
) => {
  if (step === "tag") return selectedTag !== null;
  if (step === "title") return title.trim().length > 0;
  return tasks.some(task => task.trim().length > 0);
};

const normalizeTasks = (tasks: string[]) => tasks.map(task => task.trim()).filter(Boolean);

describe("record validation logic", () => {
  describe("isProjectStepReady", () => {
    it("tag 단계에서는 태그가 선택되어야 한다", () => {
      expect(isProjectStepReady("tag", "프로젝트", "", [])).toBe(true);
      expect(isProjectStepReady("tag", null, "", [])).toBe(false);
    });

    it("title 단계에서는 공백이 아닌 제목이 있어야 한다", () => {
      expect(isProjectStepReady("title", "태그", "제목", [])).toBe(true);
      expect(isProjectStepReady("title", "태그", "  ", [])).toBe(false);
      expect(isProjectStepReady("title", "태그", "", [])).toBe(false);
    });

    it("task 단계에서는 최소 하나 이상의 유효한 태스크가 있어야 한다", () => {
      expect(isProjectStepReady("task", "태그", "제목", ["작업1"])).toBe(true);
      expect(isProjectStepReady("task", "태그", "제목", ["  ", ""])).toBe(false);
      expect(isProjectStepReady("task", "태그", "제목", [])).toBe(false);
    });
  });

  describe("normalizeTasks", () => {
    it("태스크의 앞뒤 공백을 제거하고 빈 문자열은 필터링해야 한다", () => {
      const input = ["  작업1  ", "", "   ", "작업2"];
      expect(normalizeTasks(input)).toEqual(["작업1", "작업2"]);
    });

    it("모든 태스크가 비어있으면 빈 배열을 반환해야 한다", () => {
      expect(normalizeTasks([" ", "  "])).toEqual([]);
    });
  });
});
