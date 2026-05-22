import { type SetStateAction, useEffect, useState } from "react";

import { type CalendarDailyGroupResponse, getDailyCalendar } from "@/lib/apis/record/calendar";
import {
  bulkWrite,
  type ScrumBulkWriteRequest,
  syncDailyScrum,
  type SyncDailyScrumRequest,
} from "@/lib/apis/record/scrum";
import { parseApiDate } from "@/lib/utils/calendar";
import {
  buildTodayTaskScrumsSession,
  getTodayTaskScrums,
  mapStoredScrumsToAddedProjects,
  TODAY_TASK_SCRUMS_KEY,
} from "@/lib/utils/recordSession";
import { type AddedProject, useRecordDraftStore } from "@/store/recordDraftStore";

import type { ScrumToastState } from "./useDailyScrumProjectSheet";
import type { ProjectTag } from "./useProjects";

type UseDailyScrumDraftParams = {
  projectTagItems: ProjectTag[];
  selectedProjectTag: string | null;
  projectTitle: string;
  projectTasks: string[];
  totalTaskCount: number;
  showProjectTagToast: (message: string) => void;
};

const normalizeTasks = (tasks: string[]) => tasks.map(task => task.trim()).filter(Boolean);

const getToday = () => {
  const today = new Date();

  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
};

const formatDateForApi = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const mapDailyGroupsToAddedProjects = (
  groups: CalendarDailyGroupResponse[],
  projectTags: ProjectTag[],
): AddedProject[] =>
  groups
    .filter(group => group.titleId)
    .map(group => {
      const matchedTag = projectTags.find(tag => tag.name === group.projectTag);

      return {
        id: group.titleId!,
        titleId: group.titleId,
        projectId: matchedTag?.id ?? 0,
        label: group.projectTag ?? "",
        title: group.freeText ?? "",
        tasks: group.items?.map(item => item.content ?? "") ?? [],
        scrumIds: group.items?.map(item => item.scrumId ?? null) ?? [],
      };
    });

const resolveTitleId = (project: AddedProject, dailyGroups: CalendarDailyGroupResponse[]) =>
  project.titleId ??
  dailyGroups.find(group => group.projectTag === project.label && group.freeText === project.title)
    ?.titleId;

const buildSyncDailyScrumRequest = (
  projects: AddedProject[],
  dailyGroups: CalendarDailyGroupResponse[],
): SyncDailyScrumRequest => ({
  groups: projects.flatMap(project => {
    const titleId = resolveTitleId(project, dailyGroups);
    if (!titleId) return [];

    const dailyGroup = dailyGroups.find(group => group.titleId === titleId);
    const tasks = normalizeTasks(project.tasks);

    return [
      {
        titleId,
        items: tasks.map((content, index) => ({
          scrumId:
            project.scrumIds?.[index] ??
            dailyGroup?.items?.find(item => item.content === content)?.scrumId ??
            null,
          content,
        })),
      },
    ];
  }),
});

const buildBulkWriteRequest = (date: string, projects: AddedProject[]): ScrumBulkWriteRequest => ({
  date,
  scrumsByTitle: projects.map(project => ({
    projectId: project.projectId,
    freeText: project.title,
    scrums: normalizeTasks(project.tasks).map(content => ({ content })),
  })),
});

export const useDailyScrumDraft = ({
  projectTagItems,
  selectedProjectTag,
  projectTitle,
  projectTasks,
  totalTaskCount,
  showProjectTagToast,
}: UseDailyScrumDraftParams) => {
  const selectedDateStr = useRecordDraftStore(state => state.selectedDate);
  const addedProjects = useRecordDraftStore(state => state.addedProjects);
  const setDraft = useRecordDraftStore(state => state.setDraft);
  const selectedDate = selectedDateStr ? parseApiDate(selectedDateStr) : null;
  const [scrumToastState, setScrumToastState] = useState<ScrumToastState>("hidden");
  const [scrumToastMessage, setScrumToastMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const setSelectedDate = (date: Date | null) => {
    setDraft({
      selectedDate: date ? formatDateForApi(date) : null,
    });
  };

  const setAddedProjects = (action: SetStateAction<AddedProject[]>) => {
    const previousProjects = useRecordDraftStore.getState().addedProjects;
    const nextProjects = typeof action === "function" ? action(previousProjects) : action;

    setDraft({ addedProjects: nextProjects });
  };

  const showScrumToast = (message: string) => {
    setScrumToastMessage(message);
    setScrumToastState("visible");
  };

  useEffect(() => {
    if (!selectedDate) return;

    const dateKey = formatDateForApi(selectedDate);
    const { selectedDate: storedDate, addedProjects: storedProjects } =
      useRecordDraftStore.getState();

    if (storedDate === dateKey && storedProjects.length > 0) {
      return;
    }

    const sessionScrums = getTodayTaskScrums();
    if (sessionScrums?.date === dateKey && sessionScrums.projects.length > 0) {
      const restoredProjects = mapStoredScrumsToAddedProjects(sessionScrums, projectTagItems);

      if (restoredProjects.length > 0) {
        setDraft({ selectedDate: dateKey, addedProjects: restoredProjects });
        return;
      }
    }

    let ignore = false;

    const loadDailyScrums = async () => {
      try {
        const daily = await getDailyCalendar(dateKey);
        if (ignore) return;

        const loadedProjects = mapDailyGroupsToAddedProjects(daily?.groups ?? [], projectTagItems);

        setDraft({ selectedDate: dateKey, addedProjects: loadedProjects });
      } catch {
        if (!ignore) {
          setDraft({ selectedDate: dateKey, addedProjects: [] });
        }
      }
    };

    void loadDailyScrums();

    return () => {
      ignore = true;
    };
  }, [selectedDate, projectTagItems, setDraft]);

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
    window.dispatchEvent(
      new CustomEvent("today-task-ready-change", {
        detail:
          selectedDate !== null && addedProjects.length > 0 && totalTaskCount <= 5 && !isSaving,
      }),
    );
  }, [selectedDate, addedProjects.length, isSaving, totalTaskCount]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("today-task-saving-change", { detail: isSaving }));
  }, [isSaving]);

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

  useEffect(() => {
    const handleSubmit = (event: Event) => {
      const submitEvent = event as CustomEvent<{
        onSuccess?: () => void;
        onError?: () => void;
      }>;

      if (!selectedDate || addedProjects.length === 0 || isSaving) {
        submitEvent.detail?.onError?.();
        return;
      }

      const date = formatDateForApi(selectedDate);

      const save = async () => {
        setIsSaving(true);

        try {
          const daily = await getDailyCalendar(date);
          const dailyGroups = daily?.groups ?? [];
          const hasNewTitle = addedProjects.some(project => !resolveTitleId(project, dailyGroups));

          if (dailyGroups.length > 0 && hasNewTitle) {
            await syncDailyScrum(date, { groups: [] });
            await bulkWrite(buildBulkWriteRequest(date, addedProjects));
          } else if (dailyGroups.length > 0) {
            const syncBody = buildSyncDailyScrumRequest(addedProjects, dailyGroups);

            if (syncBody.groups.length > 0) {
              await syncDailyScrum(date, syncBody);
            }
          } else {
            await bulkWrite(buildBulkWriteRequest(date, addedProjects));
          }

          const savedDaily = await getDailyCalendar(date);
          const savedProjects = mapDailyGroupsToAddedProjects(
            savedDaily?.groups ?? [],
            projectTagItems,
          );

          setDraft({
            selectedDate: date,
            addedProjects: savedProjects,
          });

          window.sessionStorage.setItem(
            TODAY_TASK_SCRUMS_KEY,
            JSON.stringify(buildTodayTaskScrumsSession(date, savedDaily?.groups ?? [])),
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
  }, [addedProjects, isSaving, projectTagItems, selectedDate, setDraft, showProjectTagToast]);

  return {
    selectedDate,
    addedProjects,
    scrumToastState,
    scrumToastMessage,
    isSaving,
    setScrumToastState,
    setSelectedDate,
    setAddedProjects,
    showScrumToast,
  };
};
