import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react";

import { api } from "@/api/client";
import { getMonthlyCalendar } from "@/lib/apis/calendar/calendar";
import { getDailyCalendar } from "@/lib/apis/record/calendar";
import {
  createProject,
  deleteProject as deleteProjectTagApi,
  getProjects,
  type ProjectSummary,
  updateProject,
} from "@/lib/apis/record/project";
import { bulkWrite, type ScrumBulkWriteRequest } from "@/lib/apis/record/scrum";
import type { UserProfile } from "@/types/user/user";

type ProjectSheetStep = "tag" | "title" | "task";
type ProjectSheetMode = "create" | "edit";
type ScrumToastState = "hidden" | "visible" | "fading";

export type AddedProject = {
  id: number;
  projectId: number;
  label: string;
  title: string;
  tasks: string[];
};

type ProjectTag = {
  id: number;
  name: string;
  deletable: boolean;
};

type UseDailyScrumReturn = {
  selectedDate: Date | null;
  calendarDraftDate: Date | null;
  calendarScrumDates: Date[];
  isCalendarOpen: boolean;
  isProjectSheetOpen: boolean;
  projectSheetMode: ProjectSheetMode;
  projectSheetStep: ProjectSheetStep;
  selectedProjectTag: string | null;
  projectTags: string[];
  createdProjectTags: string[];
  isProjectTagEditing: boolean;
  editingProjectTag: string | null;
  editingProjectTagValue: string;
  isAddingProjectTag: boolean;
  projectTitle: string;
  projectTasks: string[];
  addedProjects: AddedProject[];
  openedProjectMenuId: number | null;
  scrumToastState: ScrumToastState;
  projectTagToastState: ScrumToastState;
  projectTagToastMessage: string;
  isProjectExitModalOpen: boolean;
  isSaving: boolean;
  canAddProject: boolean;
  maxProjectTasks: number;
  projectTitlePlaceholder: string;
  projectTaskPlaceholder: string;
  getIsProjectActionEnabled: () => boolean;
  setScrumToastState: Dispatch<SetStateAction<ScrumToastState>>;
  setCalendarDraftDate: Dispatch<SetStateAction<Date | null>>;
  setEditingProjectTagValue: Dispatch<SetStateAction<string>>;
  setProjectTitle: Dispatch<SetStateAction<string>>;
  setProjectTasks: Dispatch<SetStateAction<string[]>>;
  setIsAddingProjectTag: Dispatch<SetStateAction<boolean>>;
  setIsProjectExitModalOpen: Dispatch<SetStateAction<boolean>>;
  openProjectSheet: () => void;
  openProjectEditSheet: (project: AddedProject, step: ProjectSheetStep) => void;
  openCalendarSheet: () => void;
  loadCalendarScrumDates: (monthDate: Date) => void;
  closeCalendarSheet: () => void;
  confirmCalendarDate: () => void;
  closeProjectSheet: () => void;
  requestCloseProjectSheet: () => void;
  closeProjectMenu: () => void;
  commitNewProjectTag: (value: string) => void;
  startProjectTagEdit: (projectTag: string) => void;
  cancelProjectTagEdit: () => void;
  confirmProjectTagEdit: () => void;
  deleteProjectTag: (projectTag: string) => void;
  toggleProjectMenu: (projectId: number) => void;
  deleteProject: (projectId: number) => void;
  toggleSelectedProjectTag: (projectTag: string) => void;
  startAddingProjectTag: () => void;
  handleProjectSheetHeaderTextClick: () => void;
  handleProjectPrevious: () => void;
  handleProjectNext: () => void;
};

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

const getToday = () => {
  const today = new Date();

  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
};

const formatDateForApi = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const formatMonthForApi = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const getJobRoleExampleLabel = (jobRole?: string) => {
  if (jobRole?.includes("개발")) return "개발";
  if (jobRole?.includes("디자인")) return "디자인";

  return "기획";
};

const toProjectTag = (project: ProjectSummary): ProjectTag | null => {
  if (!project.projectId || !project.name) return null;

  return {
    id: project.projectId,
    name: project.name,
    deletable: project.deletable ?? false,
  };
};

const isProjectTag = (projectTag: ProjectTag | null): projectTag is ProjectTag =>
  projectTag !== null;

const areTasksEqual = (tasksA: string[], tasksB: string[]) => {
  const normalizedTasksA = normalizeTasks(tasksA);
  const normalizedTasksB = normalizeTasks(tasksB);

  return (
    normalizedTasksA.length === normalizedTasksB.length &&
    normalizedTasksA.every((task, index) => task === normalizedTasksB[index])
  );
};

export const useDailyScrum = (): UseDailyScrumReturn => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => getToday());
  const [calendarDraftDate, setCalendarDraftDate] = useState<Date | null>(null);
  const [calendarScrumDates, setCalendarScrumDates] = useState<Date[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isProjectSheetOpen, setIsProjectSheetOpen] = useState(false);
  const [projectSheetMode, setProjectSheetMode] = useState<ProjectSheetMode>("create");
  const [projectSheetStep, setProjectSheetStep] = useState<ProjectSheetStep>("tag");
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [selectedProjectTag, setSelectedProjectTag] = useState<string | null>(null);
  const [projectTagItems, setProjectTagItems] = useState<ProjectTag[]>([]);
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
  const [isSaving, setIsSaving] = useState(false);
  const [createdProjectTagIds, setCreatedProjectTagIds] = useState<number[]>([]);
  const [jobRoleLabel, setJobRoleLabel] = useState("기획");
  const calendarScrumDateCacheRef = useRef<Record<string, boolean>>({});

  const projectTags = useMemo(
    () => projectTagItems.map(projectTag => projectTag.name),
    [projectTagItems],
  );
  const createdProjectTags = useMemo(
    () =>
      projectTagItems
        .filter(projectTag => createdProjectTagIds.includes(projectTag.id))
        .map(projectTag => projectTag.name),
    [createdProjectTagIds, projectTagItems],
  );
  const totalTaskCount = useMemo(
    () => addedProjects.reduce((count, project) => count + project.tasks.length, 0),
    [addedProjects],
  );
  const editingProjectTaskCount = useMemo(() => {
    if (editingProjectId === null) return 0;

    return addedProjects.find(project => project.id === editingProjectId)?.tasks.length ?? 0;
  }, [addedProjects, editingProjectId]);
  const maxProjectTasks =
    projectSheetMode === "edit" && projectSheetStep === "task"
      ? Math.max(0, 5 - totalTaskCount + editingProjectTaskCount)
      : Math.max(0, 5 - totalTaskCount);
  const canAddProject = totalTaskCount < 5;
  const placeholderDate = selectedDate ?? getToday();
  const projectTitlePlaceholder = `${placeholderDate.getMonth() + 1}/${placeholderDate.getDate()} ${jobRoleLabel} 작업`;
  const projectTaskPlaceholder = `${jobRoleLabel} 관련 작업`;

  const showProjectTagToast = (message: string) => {
    setProjectTagToastMessage(message);
    setProjectTagToastState("visible");
  };

  useEffect(() => {
    let ignore = false;

    const loadProjectTags = async () => {
      try {
        const response = await getProjects({ page: 0, size: 100 });
        if (ignore) return;

        setProjectTagItems(response?.projects?.map(toProjectTag).filter(isProjectTag) ?? []);
      } catch {
        if (!ignore) {
          showProjectTagToast("프로젝트 태그를 불러오지 못했어요");
        }
      }
    };

    void loadProjectTags();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    const loadProfile = async () => {
      try {
        const profile = await api.get<UserProfile>("/api/users/me");
        if (!ignore) {
          setJobRoleLabel(getJobRoleExampleLabel(profile?.jobRole));
        }
      } catch {
        if (!ignore) {
          setJobRoleLabel("기획");
        }
      }
    };

    void loadProfile();

    return () => {
      ignore = true;
    };
  }, []);

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
      projectTagToastState === "visible" ? 4000 : 300,
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
        detail:
          selectedDate !== null && addedProjects.length > 0 && totalTaskCount <= 5 && !isSaving,
      }),
    );
  }, [selectedDate, addedProjects.length, isSaving, totalTaskCount]);

  useEffect(() => {
    return () => {
      window.dispatchEvent(new CustomEvent("today-task-ready-change", { detail: false }));
    };
  }, []);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("today-task-dirty-change", {
        detail:
          (selectedDate !== null &&
            formatDateForApi(selectedDate) !== formatDateForApi(getToday())) ||
          addedProjects.length > 0 ||
          selectedProjectTag !== null ||
          projectTitle.trim().length > 0 ||
          projectTasks.some(task => task.trim().length > 0),
      }),
    );
  }, [addedProjects.length, projectTasks, projectTitle, selectedDate, selectedProjectTag]);

  useEffect(() => {
    return () => {
      window.dispatchEvent(new CustomEvent("today-task-dirty-change", { detail: false }));
    };
  }, []);

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

  const loadCalendarScrumDates = (monthDate: Date) => {
    const load = async () => {
      try {
        const monthlyCalendar = await getMonthlyCalendar(formatMonthForApi(monthDate));
        const scrumDates =
          monthlyCalendar?.days
            ?.filter(day => day.hasScrums && day.date)
            .map(day => new Date(`${day.date}T00:00:00`)) ?? [];

        monthlyCalendar?.days?.forEach(day => {
          if (day.date) {
            calendarScrumDateCacheRef.current[day.date] = day.hasScrums ?? false;
          }
        });

        setCalendarScrumDates(scrumDates);
      } catch {
        setCalendarScrumDates([]);
      }
    };

    void load();
  };

  const openCalendarSheet = () => {
    setCalendarDraftDate(selectedDate);
    loadCalendarScrumDates(selectedDate ?? new Date());
    setIsCalendarOpen(true);
  };

  const closeCalendarSheet = () => {
    setCalendarDraftDate(selectedDate);
    setIsCalendarOpen(false);
  };

  const confirmCalendarDate = async () => {
    if (!calendarDraftDate) return;

    try {
      const dailyCalendar = await getDailyCalendar(formatDateForApi(calendarDraftDate));

      if ((dailyCalendar?.groups?.length ?? 0) > 0) {
        calendarScrumDateCacheRef.current[formatDateForApi(calendarDraftDate)] = true;
        setCalendarScrumDates(currentDates => {
          const dateKey = formatDateForApi(calendarDraftDate);
          if (currentDates.some(date => formatDateForApi(date) === dateKey)) return currentDates;

          return [...currentDates, calendarDraftDate];
        });
        setScrumToastState("visible");
        return;
      }

      calendarScrumDateCacheRef.current[formatDateForApi(calendarDraftDate)] = false;
      setSelectedDate(calendarDraftDate);
      setIsCalendarOpen(false);
    } catch {
      setScrumToastState("visible");
    }
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

  const commitNewProjectTag = async (value: string) => {
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

    try {
      const createdProject = await createProject({ name: trimmedTag });
      if (!createdProject?.projectId || !createdProject.name) return;

      const createdProjectId = createdProject.projectId;
      const newProjectTag: ProjectTag = {
        id: createdProjectId,
        name: createdProject.name,
        deletable: true,
      };

      setProjectTagItems(currentTags =>
        currentTags.some(projectTag => projectTag.id === createdProjectId)
          ? currentTags
          : [...currentTags, newProjectTag],
      );
      setCreatedProjectTagIds(currentIds =>
        currentIds.includes(createdProjectId) ? currentIds : [...currentIds, createdProjectId],
      );
      setSelectedProjectTag(createdProject.name);
      setIsAddingProjectTag(false);
    } catch {
      showProjectTagToast("프로젝트 태그를 추가하지 못했어요");
    }
  };

  const startProjectTagEdit = (projectTag: string) => {
    setEditingProjectTag(projectTag);
    setEditingProjectTagValue(projectTag);
  };

  const cancelProjectTagEdit = () => {
    setEditingProjectTag(null);
    setEditingProjectTagValue("");
  };

  const confirmProjectTagEdit = async () => {
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

    const projectTag = projectTagItems.find(projectTag => projectTag.name === editingProjectTag);
    if (!projectTag) return;

    try {
      await updateProject(projectTag.id, { name: trimmedTag });
      setProjectTagItems(currentTags =>
        currentTags.map(currentTag =>
          currentTag.id === projectTag.id ? { ...currentTag, name: trimmedTag } : currentTag,
        ),
      );
      setAddedProjects(currentProjects =>
        currentProjects.map(project =>
          project.projectId === projectTag.id ? { ...project, label: trimmedTag } : project,
        ),
      );
      setSelectedProjectTag(currentTag =>
        currentTag === editingProjectTag ? trimmedTag : currentTag,
      );
      showProjectTagToast("프로젝트 태그명이 변경되었어요");
      cancelProjectTagEdit();
    } catch {
      showProjectTagToast("프로젝트 태그명을 변경하지 못했어요");
    }
  };

  const deleteProjectTag = async (projectTag: string) => {
    const targetProjectTag = projectTagItems.find(currentTag => currentTag.name === projectTag);
    if (!targetProjectTag) return;

    try {
      await deleteProjectTagApi(targetProjectTag.id);
      setProjectTagItems(currentTags =>
        currentTags.filter(currentTag => currentTag.id !== targetProjectTag.id),
      );
      setCreatedProjectTagIds(currentIds =>
        currentIds.filter(currentId => currentId !== targetProjectTag.id),
      );
      setSelectedProjectTag(currentTag => (currentTag === projectTag ? null : currentTag));
      setAddedProjects(currentProjects =>
        currentProjects.filter(project => project.projectId !== targetProjectTag.id),
      );
      showProjectTagToast("프로젝트 태그가 삭제되었어요");
    } catch {
      showProjectTagToast("프로젝트 태그를 삭제하지 못했어요");
    }

    if (editingProjectTag === projectTag) {
      cancelProjectTagEdit();
    }
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

    if (normalizedProjectTasks.length === 0 || normalizedProjectTasks.length > maxProjectTasks) {
      return;
    }

    const selectedProjectId =
      projectTagItems.find(projectTag => projectTag.name === selectedProjectTag)?.id ?? null;
    if (!selectedProjectId) return;

    setAddedProjects(currentProjects => [
      ...currentProjects,
      {
        id: Date.now(),
        projectId: selectedProjectId,
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

    return (
      isProjectStepReady(projectSheetStep, selectedProjectTag, projectTitle, projectTasks) &&
      (projectSheetStep !== "task" ||
        (normalizedProjectTasks.length > 0 && normalizedProjectTasks.length <= maxProjectTasks))
    );
  };

  useEffect(() => {
    const handleSubmit = (event: Event) => {
      const submitEvent = event as CustomEvent<{
        onSuccess?: () => void;
        onError?: () => void;
      }>;

      if (!selectedDate || addedProjects.length === 0 || isSaving) return;

      const body: ScrumBulkWriteRequest = {
        date: formatDateForApi(selectedDate),
        scrumsByTitle: addedProjects.map(project => ({
          projectId: project.projectId,
          freeText: project.title,
          scrums: project.tasks.map(task => ({ content: task })),
        })),
      };

      const save = async () => {
        setIsSaving(true);

        try {
          const savedProjects = await bulkWrite(body);

          window.sessionStorage.setItem(
            "today-task-scrums",
            JSON.stringify({
              date: body.date,
              projects: savedProjects ?? [],
            }),
          );
          submitEvent.detail?.onSuccess?.();
        } catch {
          showProjectTagToast("오늘의 작업을 저장하지 못했어요");
          submitEvent.detail?.onError?.();
        } finally {
          setIsSaving(false);
        }
      };

      void save();
    };

    window.addEventListener("today-task-submit", handleSubmit);

    return () => {
      window.removeEventListener("today-task-submit", handleSubmit);
    };
  }, [addedProjects, isSaving, selectedDate]);

  return {
    selectedDate,
    calendarDraftDate,
    calendarScrumDates,
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
    isSaving,
    canAddProject,
    maxProjectTasks,
    projectTitlePlaceholder,
    projectTaskPlaceholder,
    getIsProjectActionEnabled,
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
    loadCalendarScrumDates,
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
