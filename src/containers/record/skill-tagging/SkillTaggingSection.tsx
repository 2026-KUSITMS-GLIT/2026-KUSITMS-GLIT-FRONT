"use client";

import { useSearchParams } from "next/navigation";

import SkillTaggingFail from "./SkillTaggingFail";
import SkillTaggingSuccess from "./SkillTaggingSuccess";

interface SkillTaggingTask {
  id: number;
  title: string;
  projectId: number;
  projectTag: string;
  projectTitle: string;
  skillId: number;
}

function getStoredTasks() {
  if (typeof window === "undefined") return [];

  if (!window.sessionStorage.getItem("star-log-tasks")) return [];

  try {
    return ((parsedTasks: SkillTaggingTask[]) => (parsedTasks.length > 0 ? parsedTasks : []))(
      JSON.parse(window.sessionStorage.getItem("star-log-tasks") ?? "[]") as SkillTaggingTask[],
    );
  } catch {
    return [];
  }
}

const SkillTaggingSection = () => {
  const searchParams = useSearchParams();
  const state = searchParams.get("state");

  if (state === "fail") {
    return <SkillTaggingFail />;
  }

  return (
    <SkillTaggingSuccess tasks={getStoredTasks()} shouldCheckMiniReport={state === "success"} />
  );
};

export default SkillTaggingSection;
