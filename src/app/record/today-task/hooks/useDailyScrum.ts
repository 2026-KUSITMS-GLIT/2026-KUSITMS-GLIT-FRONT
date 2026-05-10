import { useEffect, useState } from "react";

import { TODAY_TASK_MOCK } from "@/data/record/mock";

type ProjectSheetStep = "tag" | "title" | "task";
type ProjectSheetMode = "create" | "edit";
type ScrumToastState = "hidden" | "visible" | "fading";

type AddedProject = {
  id: number;
  label: string;
  title: string;
  tasks: string[];
};

const MAX_TOTAL_TASK_COUNT = 5;

const isProjectStepReady = (
  step: ProjectSheetStep,
  selectedTag: string | null,
  title: string,
  tasks: string[],
) => {
  if (step === "tag") return selectedTag !== null;
  if (step === "title") return title.trim().length > 0;
  return tasks.some(task => task.trim().length > 0);
};

const normalizeTasks = (tasks: string[]) => tasks.map(task => task.trim()).filter(Boolean);

const areTasksEqual = (tasksA: string[], tasksB: string[]) => {
  const normalizedTasksA = normalizeTasks(tasksA);
  const normalizedTasksB = normalizeTasks(tasksB);

  return (
    normalizedTasksA.length === normalizedTasksB.length &&
    normalizedTasksA.every((task, index) => task === normalizedTasksB[index])
  );
};

export const useDailyScrum = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarDraftDate, setCalendarDraftDate] = useState<Date | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isProjectSheetOpen, setIsProjectSheetOpen] = useState(false);
  const [projectSheetMode, setProjectSheetMode] = useState<ProjectSheetMode>("create");
  const [projectSheetStep, setProjectSheetStep] = useState<ProjectSheetStep>("tag");
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [selectedProjectTag, setSelectedProjectTag] = useState<string | null>(null);
  const [projectTags, setProjectTags] = useState(TODAY_TASK_MOCK.projectTags);
  const [createdProjectTags, setCreatedProjectTags] = useState<string[]>([]);
  const [isProjectTagEditing, setIsProjectTagEditing] = useState(false);
  const [editingProjectTag, setEditingProjectTag] = useState<string | null>(null);
  const [editingProjectTagValue, setEditingProjectTagValue] = useState("");
  const [isAddingProjectTag, setIsAddingProjectTag] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectTasks, setProjectTasks] = useState<string[]>([]);
  const [addedProjects, setAddedProjects] = useState<AddedProject[]>([]);
  const [openedProjectMenuId, setOpenedProjectMenuId] = useState<number | null>(null);
  const [scrumToastState, setScrumToastState] = useState<ScrumToastState>("hidden");
  const [projectTagToastState, setProjectTagToastState] = useState<ScrumToastState>("hidden");
  const [projectTagToastMessage, setProjectTagToastMessage] = useState("");
  const [isProjectExitModalOpen, setIsProjectExitModalOpen] = useState(false);

  useEffect(() => {
    if (scrumToastState === "hidden") return;

    const toastTimer = window.setTimeout(
      () => {
        setScrumToastState(scrumToastState === "visible" ? "fading" : "hidden");
      },
      scrumToastState === "visible" ? 1700 : 300,
    );

    return () => {
      window.clearTimeout(toastTimer);
    };
  }, [scrumToastState]);

  useEffect(() => {
    if (projectTagToastState === "hidden") return;

    const toastTimer = window.setTimeout(
      () => {
        setProjectTagToastState(projectTagToastState === "visible" ? "fading" : "hidden");
      },
      projectTagToastState === "visible" ? 1700 : 300,
    );

    return () => {
      window.clearTimeout(toastTimer);
    };
  }, [projectTagToastState]);

  useEffect(() => {
    if (openedProjectMenuId === null) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return;

      if (event.target.closest("[data-project-menu]")) {
        return;
      }

      setOpenedProjectMenuId(null);
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [openedProjectMenuId]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("today-task-ready-change", {
        detail: selectedDate !== null && addedProjects.length > 0,
      }),
    );

    return () => {
      window.dispatchEvent(new CustomEvent("today-task-ready-change", { detail: false }));
    };
  }, [selectedDate, addedProjects.length]);

  const openProjectSheet = () => {
    setProjectSheetMode("create");
    setProjectSheetStep("tag");
    setEditingProjectId(null);
    setSelectedProjectTag(null);
    setProjectTitle("");
    setProjectTasks([]);
    setIsProjectTagEditing(false);
    setEditingProjectTag(null);
    setEditingProjectTagValue("");
    setIsProjectSheetOpen(true);
  };

  const openProjectEditSheet = (project: AddedProject, step: ProjectSheetStep) => {
    setProjectSheetMode("edit");
    setEditingProjectId(project.id);
    setProjectSheetStep(step);
    setSelectedProjectTag(project.label);
    setProjectTitle(project.title);
    setProjectTasks(project.tasks);
    setIsAddingProjectTag(false);
    setIsProjectTagEditing(false);
    setEditingProjectTag(null);
    setEditingProjectTagValue("");
    closeProjectMenu();
    setIsProjectSheetOpen(true);
  };

  const openCalendarSheet = () => {
    setCalendarDraftDate(selectedDate);
    setIsCalendarOpen(true);
  };

  const closeCalendarSheet = () => {
    setCalendarDraftDate(selectedDate);
    setIsCalendarOpen(false);
  };

  const confirmCalendarDate = () => {
    if (!calendarDraftDate) return;

    setSelectedDate(calendarDraftDate);
    setIsCalendarOpen(false);
  };

  const closeProjectSheet = () => {
    setIsAddingProjectTag(false);
    setIsProjectTagEditing(false);
    setEditingProjectTag(null);
    setEditingProjectTagValue("");
    setIsProjectExitModalOpen(false);
    setIsProjectSheetOpen(false);
  };

  const requestCloseProjectSheet = () => {
    if (projectSheetMode === "create") {
      setIsProjectExitModalOpen(true);
      return;
    }

    closeProjectSheet();
  };

  const closeProjectMenu = () => {
    setOpenedProjectMenuId(null);
  };

  const commitNewProjectTag = (value: string) => {
    const trimmedTag = value.trim();

    if (trimmedTag.length === 0) {
      setIsAddingProjectTag(false);
      return;
    }

    if (projectTags.includes(trimmedTag)) {
      setSelectedProjectTag(trimmedTag);
      setIsAddingProjectTag(false);
      return;
    }

    setProjectTags(currentTags =>
      currentTags.includes(trimmedTag) ? currentTags : [...currentTags, trimmedTag],
    );
    setCreatedProjectTags(currentTags =>
      currentTags.includes(trimmedTag) ? currentTags : [...currentTags, trimmedTag],
    );
    setSelectedProjectTag(trimmedTag);
    setIsAddingProjectTag(false);
  };

  const startProjectTagEdit = (projectTag: string) => {
    setEditingProjectTag(projectTag);
    setEditingProjectTagValue(projectTag);
  };

  const cancelProjectTagEdit = () => {
    setEditingProjectTag(null);
    setEditingProjectTagValue("");
  };

  const confirmProjectTagEdit = () => {
    if (!editingProjectTag) return;

    const trimmedTag = editingProjectTagValue.trim();

    if (trimmedTag.length === 0 || trimmedTag === editingProjectTag) {
      cancelProjectTagEdit();
      return;
    }

    if (projectTags.includes(trimmedTag)) {
      cancelProjectTagEdit();
      return;
    }

    setProjectTags(currentTags =>
      currentTags.map(projectTag => (projectTag === editingProjectTag ? trimmedTag : projectTag)),
    );
    setCreatedProjectTags(currentTags =>
      currentTags.map(projectTag => (projectTag === editingProjectTag ? trimmedTag : projectTag)),
    );
    setAddedProjects(currentProjects =>
      currentProjects.map(project =>
        project.label === editingProjectTag ? { ...project, label: trimmedTag } : project,
      ),
    );
    setSelectedProjectTag(currentTag =>
      currentTag === editingProjectTag ? trimmedTag : currentTag,
    );
    setProjectTagToastMessage("프로젝트 태그명이 변경되었어요");
    setProjectTagToastState("visible");
    cancelProjectTagEdit();
  };

  const deleteProjectTag = (projectTag: string) => {
    setProjectTags(currentTags => currentTags.filter(currentTag => currentTag !== projectTag));
    setCreatedProjectTags(currentTags =>
      currentTags.filter(currentTag => currentTag !== projectTag),
    );
    setSelectedProjectTag(currentTag => (currentTag === projectTag ? null : currentTag));
    if (editingProjectTag === projectTag) {
      cancelProjectTagEdit();
    }
    setProjectTagToastMessage("프로젝트 태그가 삭제되었어요");
    setProjectTagToastState("visible");
  };

  const toggleProjectMenu = (projectId: number) => {
    setOpenedProjectMenuId(currentId => (currentId === projectId ? null : projectId));
  };

  const deleteProject = (projectId: number) => {
    setAddedProjects(currentProjects =>
      currentProjects.filter(currentProject => currentProject.id !== projectId),
    );
    closeProjectMenu();
  };

  const toggleSelectedProjectTag = (projectTag: string) => {
    setSelectedProjectTag(currentTag => (currentTag === projectTag ? null : projectTag));
  };

  const startAddingProjectTag = () => {
    cancelProjectTagEdit();
    setSelectedProjectTag(null);
    setIsAddingProjectTag(true);
  };

  const handleProjectSheetHeaderTextClick = () => {
    if (isProjectTagEditing) {
      confirmProjectTagEdit();
      setIsProjectTagEditing(false);
      return;
    }

    if (createdProjectTags.length > 0) {
      setIsProjectTagEditing(true);
      setIsAddingProjectTag(false);
    }
  };

  const handleProjectPrevious = () => {
    if (projectSheetStep === "task") {
      setProjectSheetStep("title");
      return;
    }

    if (projectSheetStep === "title") {
      setProjectSheetStep("tag");
      return;
    }

    requestCloseProjectSheet();
  };

  const handleProjectNext = () => {
    const normalizedProjectTasks = normalizeTasks(projectTasks);

    if (projectSheetMode === "edit") {
      const editingProject =
        editingProjectId === null
          ? null
          : (addedProjects.find(project => project.id === editingProjectId) ?? null);

      if (!editingProject) return;

      const taskCountOutsideEditingProject = addedProjects.reduce((acc, project) => {
        if (project.id === editingProjectId) return acc;
        return acc + project.tasks.length;
      }, 0);

      const maxProjectTasks = Math.max(1, MAX_TOTAL_TASK_COUNT - taskCountOutsideEditingProject);

      const hasProjectEditChanges =
        (projectSheetStep === "tag" &&
          selectedProjectTag !== null &&
          selectedProjectTag !== editingProject.label) ||
        (projectSheetStep === "title" &&
          projectTitle.trim().length > 0 &&
          projectTitle.trim() !== editingProject.title) ||
        (projectSheetStep === "task" &&
          normalizedProjectTasks.length > 0 &&
          normalizedProjectTasks.length <= maxProjectTasks &&
          !areTasksEqual(projectTasks, editingProject.tasks));

      if (!hasProjectEditChanges) {
        return;
      }

      setAddedProjects(currentProjects =>
        currentProjects.map(project => {
          if (project.id !== editingProject.id) return project;

          if (projectSheetStep === "tag") {
            return { ...project, label: selectedProjectTag ?? project.label };
          }

          if (projectSheetStep === "title") {
            return { ...project, title: projectTitle.trim() };
          }

          if (normalizedProjectTasks.length > maxProjectTasks) return project;

          return { ...project, tasks: normalizedProjectTasks };
        }),
      );
      closeProjectSheet();
      return;
    }

    if (projectSheetStep === "tag") {
      if (!selectedProjectTag) {
        return;
      }

      setProjectSheetStep("title");
      return;
    }

    if (projectSheetStep === "title") {
      if (projectTitle.trim().length === 0) {
        return;
      }

      setProjectSheetStep("task");
      return;
    }

    const remainingTaskCount = MAX_TOTAL_TASK_COUNT - addedProjects.reduce((acc, project) => acc + project.tasks.length, 0);

    if (normalizedProjectTasks.length === 0 || normalizedProjectTasks.length > remainingTaskCount) {
      return;
    }

    setAddedProjects(currentProjects => [
      ...currentProjects,
      {
        id: Date.now(),
        label: selectedProjectTag ?? "",
        title: projectTitle.trim(),
        tasks: normalizedProjectTasks,
      },
    ]);
    setSelectedProjectTag(null);
    setProjectTitle("");
    setProjectTasks([]);
    setProjectSheetStep("tag");
    closeProjectMenu();
    closeProjectSheet();
  };

  const getIsProjectActionEnabled = () => {
    const normalizedProjectTasks = normalizeTasks(projectTasks);
    if (projectSheetMode === "edit") {
      const editingProject =
        editingProjectId === null
          ? null
          : (addedProjects.find(project => project.id === editingProjectId) ?? null);
      if (!editingProject) return false;

      const taskCountOutsideEditingProject = addedProjects.reduce((acc, project) => {
        if (project.id === editingProjectId) return acc;
        return acc + project.tasks.length;
      }, 0);
      const maxProjectTasks = Math.max(
        1,
        MAX_TOTAL_TASK_COUNT - taskCountOutsideEditingProject,
      );

      return (
        (projectSheetStep === "tag" &&
          selectedProjectTag !== null &&
          selectedProjectTag !== editingProject.label) ||
        (projectSheetStep === "title" &&
          projectTitle.trim().length > 0 &&
          projectTitle.trim() !== editingProject.title) ||
        (projectSheetStep === "task" &&
          normalizedProjectTasks.length > 0 &&
          normalizedProjectTasks.length <= maxProjectTasks &&
          !areTasksEqual(projectTasks, editingProject.tasks))
      );
    }

    const remainingTaskCount =
      MAX_TOTAL_TASK_COUNT -
      addedProjects.reduce((acc, project) => acc + project.tasks.length, 0);

    return (
      isProjectStepReady(projectSheetStep, selectedProjectTag, projectTitle, projectTasks) &&
      (projectSheetStep !== "task" ||
        (normalizedProjectTasks.length > 0 &&
          normalizedProjectTasks.length <= remainingTaskCount))
    );
  };

  const getMaxProjectTasks = () => {
    return projectSheetMode === "edit"
      ? Math.max(
          1,
          MAX_TOTAL_TASK_COUNT -
            addedProjects.reduce((acc, project) => {
              if (project.id === editingProjectId) return acc;
              return acc + project.tasks.length;
            }, 0),
        )
      : Math.max(
          1,
          MAX_TOTAL_TASK_COUNT -
            addedProjects.reduce((acc, project) => acc + project.tasks.length, 0),
        );
  };

  return {
    selectedDate,
    calendarDraftDate,
    isCalendarOpen,
    isProjectSheetOpen,
    projectSheetMode,
    projectSheetStep,
    selectedProjectTag,
    projectTags,
    createdProjectTags,
    isProjectTagEditing,
    editingProjectTag,
    editingProjectTagValue,
    isAddingProjectTag,
    projectTitle,
    projectTasks,
    addedProjects,
    openedProjectMenuId,
    scrumToastState,
    projectTagToastState,
    projectTagToastMessage,
    isProjectExitModalOpen,
    MAX_TOTAL_TASK_COUNT,
    getIsProjectActionEnabled,
    getMaxProjectTasks,
    setScrumToastState,
    setCalendarDraftDate,
    setEditingProjectTagValue,
    setProjectTitle,
    setProjectTasks,
    setIsAddingProjectTag,
    setIsProjectExitModalOpen,
    openProjectSheet,
    openProjectEditSheet,
    openCalendarSheet,
    closeCalendarSheet,
    confirmCalendarDate,
    closeProjectSheet,
    requestCloseProjectSheet,
    closeProjectMenu,
    commitNewProjectTag,
    startProjectTagEdit,
    cancelProjectTagEdit,
    confirmProjectTagEdit,
    deleteProjectTag,
    toggleProjectMenu,
    deleteProject,
    toggleSelectedProjectTag,
    startAddingProjectTag,
    handleProjectSheetHeaderTextClick,
    handleProjectPrevious,
    handleProjectNext,
  };
};
