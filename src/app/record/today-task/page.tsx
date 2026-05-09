"use client";

import { useEffect, useState } from "react";

import {
  CalendarIcon,
  CancelIcon,
  ChevronDownIcon,
  MyPageIcon,
  PlusIcon,
  StarOneIcon,
  ThreeDotsIcon,
} from "@/assets/icons";
import Calendar from "@/components/calendar/Calendar";
import BottomSheet from "@/components/common/BottomSheet";
import Button from "@/components/common/Button";
import Chip from "@/components/common/Chip";
import CTA from "@/components/common/CTA";
import Tag from "@/components/common/Tag";
import TextField from "@/components/common/TextField";
import Toast from "@/components/common/Toast";
import { TODAY_TASK_MOCK } from "@/data/record/mock";
import { cn } from "@/lib/utils";

type ProjectSheetStep = "tag" | "title" | "task";
type AddedProject = {
  id: number;
  label: string;
  title: string;
  tasks: string[];
};

const formatDate = (date: Date) =>
  `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;

const isSameDate = (dateA: Date, dateB: Date) =>
  dateA.getFullYear() === dateB.getFullYear() &&
  dateA.getMonth() === dateB.getMonth() &&
  dateA.getDate() === dateB.getDate();

const isProjectStepReady = (
  step: ProjectSheetStep,
  selectedTag: string | null,
  title: string,
  task: string,
) => {
  if (step === "tag") return selectedTag !== null;
  if (step === "title") return title.trim().length > 0;
  return task.trim().length > 0;
};

export default function DailyScrumPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isProjectSheetOpen, setIsProjectSheetOpen] = useState(false);
  const [projectSheetStep, setProjectSheetStep] = useState<ProjectSheetStep>("tag");
  const [selectedProjectTag, setSelectedProjectTag] = useState<string | null>(null);
  const [projectTags, setProjectTags] = useState(TODAY_TASK_MOCK.projectTags);
  const [isAddingProjectTag, setIsAddingProjectTag] = useState(false);
  const [newProjectTag, setNewProjectTag] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectTask, setProjectTask] = useState("");
  const [addedProjects, setAddedProjects] = useState<AddedProject[]>([]);
  const [openedProjectMenuId, setOpenedProjectMenuId] = useState<number | null>(null);
  const [showScrumToast, setShowScrumToast] = useState(false);

  const date = selectedDate ?? TODAY_TASK_MOCK.initialDate;
  const canGoNext = isProjectStepReady(
    projectSheetStep,
    selectedProjectTag,
    projectTitle,
    projectTask,
  );

  useEffect(() => {
    if (!showScrumToast) return;

    const toastTimer = window.setTimeout(() => {
      setShowScrumToast(false);
    }, 2000);

    return () => {
      window.clearTimeout(toastTimer);
    };
  }, [showScrumToast]);

  const openProjectSheet = () => {
    setProjectSheetStep("tag");
    setIsProjectSheetOpen(true);
  };

  const closeProjectSheet = () => {
    setIsAddingProjectTag(false);
    setNewProjectTag("");
    setIsProjectSheetOpen(false);
  };

  const closeProjectMenu = () => {
    setOpenedProjectMenuId(null);
  };

  const commitNewProjectTag = () => {
    const trimmedTag = newProjectTag.trim();

    if (trimmedTag.length === 0) {
      setIsAddingProjectTag(false);
      return;
    }

    setProjectTags(currentTags =>
      currentTags.includes(trimmedTag) ? currentTags : [...currentTags, trimmedTag],
    );
    setSelectedProjectTag(trimmedTag);
    setNewProjectTag("");
    setIsAddingProjectTag(false);
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

    closeProjectSheet();
  };

  const handleProjectNext = () => {
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

    if (projectTask.trim().length === 0) {
      return;
    }

    const tasks = projectTask
      .split("\n")
      .map(task => task.trim().replace(/^\d+[.)]\s*/, ""))
      .filter(Boolean);

    setAddedProjects(currentProjects => [
      ...currentProjects,
      {
        id: Date.now(),
        label: selectedProjectTag ?? "",
        title: projectTitle.trim(),
        tasks,
      },
    ]);
    setSelectedProjectTag(null);
    setProjectTitle("");
    setProjectTask("");
    setProjectSheetStep("tag");
    closeProjectMenu();
    closeProjectSheet();
  };

  return (
    <>
      <Toast
        contents="프로젝트 수 상관없이 총 5개의 작업만 작성 가능해요"
        leftIcon={<MyPageIcon className="text-offwhite-600 size-6" />}
        showCloseButton={false}
        className="bg-gray-850/85 w-full p-3"
      />

      {showScrumToast && (
        <Toast
          contents="이미 스크럼이 있는 날짜예요"
          showCloseButton={false}
          className="fixed bottom-9.5 left-1/2 z-[60] w-[calc(100%-2.5rem)] max-w-97.5 -translate-x-1/2 justify-center"
        />
      )}

      {/* 날짜 */}
      <div className="mt-5.5 mb-8 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setIsCalendarOpen(true)}
          className="flex w-fit cursor-pointer items-center gap-0.25 text-left">
          <CalendarIcon className="size-5 text-gray-100" />
          <span className="body-2 text-gray-100">날짜</span>
        </button>
        <TextField
          readOnly
          value={formatDate(date)}
          onClick={() => setIsCalendarOpen(true)}
          rightIcon={<ChevronDownIcon />}
          onRightIconClick={() => setIsCalendarOpen(true)}
          rightIconClassName="text-gray-800"
          wrapperClassName="border-gray-800 has-[input:not(:placeholder-shown):focus]:border-gray-800 has-[input:not(:placeholder-shown):not(:focus)]:border-gray-800"
          className={cn("body-2 cursor-pointer", selectedDate ? "text-gray-100" : "text-gray-800")}
        />
      </div>

      {/* 프로젝트 */}
      <div className="flex flex-col gap-2">
        <div className="inline-flex w-fit items-center gap-0.25">
          <StarOneIcon className="size-5 shrink-0 text-gray-100" />
          <span className="body-2 inline-flex items-center text-gray-100">프로젝트</span>
        </div>
        {addedProjects.length > 0 ? (
          <div className="flex flex-col gap-3">
            {addedProjects.map(project => (
              <article
                key={project.id}
                className="rounded-6 bg-gray-850 relative flex min-h-20 flex-col px-4 py-3.5">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <Tag variant="gray">{project.label}</Tag>
                  <button
                    type="button"
                    aria-expanded={openedProjectMenuId === project.id}
                    aria-label={`${project.title} 더보기`}
                    onClick={() =>
                      setOpenedProjectMenuId(currentId =>
                        currentId === project.id ? null : project.id,
                      )
                    }
                    className="-mt-1 -mr-1 flex items-center justify-center text-gray-500">
                    <ThreeDotsIcon className="size-5" />
                  </button>
                </div>

                {openedProjectMenuId === project.id && (
                  <div
                    role="menu"
                    className="rounded-6 absolute top-9 right-3 z-10 flex min-w-18 flex-col overflow-hidden border border-gray-700 bg-gray-800 py-1 shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={closeProjectMenu}
                      className="body-4 cursor-pointer px-3 py-2 text-left text-gray-100 hover:bg-gray-700">
                      수정
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setAddedProjects(currentProjects =>
                          currentProjects.filter(
                            currentProject => currentProject.id !== project.id,
                          ),
                        );
                        closeProjectMenu();
                      }}
                      className="body-4 text-error-primary cursor-pointer px-3 py-2 text-left hover:bg-gray-700">
                      삭제
                    </button>
                  </div>
                )}

                <strong className="body-3 mb-1 text-white">{project.title}</strong>
                <ol className="flex flex-col gap-0.5">
                  {project.tasks.map((task, index) => (
                    <li key={`${project.id}-${task}`} className="body-4 text-gray-400">
                      {index + 1}. {task}
                    </li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-8 bg-gray-850/60 flex min-h-29.5 w-full flex-col items-center justify-center">
            <span className="body-4 text-center text-gray-600">
              아직 프로젝트가 없어요
              <br />
              오늘 경험한 일을 기록해봐요
            </span>
          </div>
        )}

        <CTA leftIcon={<PlusIcon />} className="mt-3.5" onClick={openProjectSheet}>
          프로젝트 추가하기
        </CTA>
      </div>

      {/* 캘린더 바텀시트 */}
      <BottomSheet
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        text="완료"
        onTextClick={() => setIsCalendarOpen(false)}>
        <div className="w-full px-5 pt-2.5 pb-7.5">
          <Calendar
            mode="single"
            selected={date}
            className="w-full p-0"
            classNames={{
              root: "w-full",
              months: "relative flex w-full flex-col gap-4 md:flex-row",
              month: "flex w-full flex-col gap-4",
            }}
            onSelect={newDate => {
              if (newDate) {
                if (TODAY_TASK_MOCK.scrumDates.some(scrumDate => isSameDate(scrumDate, newDate))) {
                  setShowScrumToast(true);
                  return;
                }

                setSelectedDate(newDate);
                setIsCalendarOpen(false);
              }
            }}
            modifiers={{
              otherSelected: new Date(),
              scrum: TODAY_TASK_MOCK.scrumDates,
            }}
          />
        </div>
      </BottomSheet>

      {/* 프로젝트 바텀시트 */}
      <BottomSheet
        isOpen={isProjectSheetOpen}
        onClose={closeProjectSheet}
        text="편집"
        textClassName="body-3 text-gray-400">
        <div className="flex min-h-92.5 flex-col px-5 pt-3 pb-7">
          <div className={cn(projectSheetStep === "tag" ? "mb-6" : "mb-14")}>
            <h2 className="body-5 text-white">
              {projectSheetStep === "tag"
                ? "프로젝트 태그 선택"
                : projectSheetStep === "title"
                  ? "제목"
                  : "작업"}
            </h2>
            <p className="body-4 text-gray-400">
              {projectSheetStep === "tag"
                ? "최대 1개만 선택할 수 있어요"
                : projectSheetStep === "title"
                  ? "이 프로젝트에서 한 작업들의 제목을 적어요"
                  : "작업 당 최대 50자까지 적을 수 있어요"}
            </p>
          </div>

          {projectSheetStep === "tag" ? (
            <div className="flex flex-wrap gap-3">
              {projectTags.map(projectTag => (
                <Chip
                  key={projectTag}
                  selected={selectedProjectTag === projectTag}
                  onClick={() =>
                    setSelectedProjectTag(currentTag =>
                      currentTag === projectTag ? null : projectTag,
                    )
                  }
                  className={cn(
                    "border",
                    selectedProjectTag === projectTag
                      ? "border-sea-blue-400"
                      : "border-transparent",
                    !selectedProjectTag && "opacity-100",
                  )}>
                  {projectTag}
                </Chip>
              ))}
              {isAddingProjectTag ? (
                <label className="body-4 rounded-6 border-sea-blue-400 inline-flex w-fit items-center border bg-gray-800 px-2 py-2.5 text-white">
                  <span className="flex items-center gap-0.75 px-px">
                    <PlusIcon className="size-4 shrink-0" />
                    <input
                      autoFocus
                      value={newProjectTag}
                      onChange={event => setNewProjectTag(event.target.value)}
                      onBlur={commitNewProjectTag}
                      onKeyDown={event => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          commitNewProjectTag();
                        }

                        if (event.key === "Escape") {
                          setNewProjectTag("");
                          setIsAddingProjectTag(false);
                        }
                      }}
                      style={{ width: `${Math.max(newProjectTag.length, 2)}ch` }}
                      className="min-w-2 bg-transparent outline-none"
                    />
                  </span>
                </label>
              ) : (
                <Chip
                  leftIcon={<PlusIcon />}
                  selected={false}
                  onClick={() => {
                    setSelectedProjectTag(null);
                    setIsAddingProjectTag(true);
                  }}
                  className="border border-transparent bg-gray-900 opacity-100">
                  추가
                </Chip>
              )}
            </div>
          ) : projectSheetStep === "title" ? (
            <TextField
              value={projectTitle}
              onChange={event => setProjectTitle(event.target.value)}
              placeholder="ex. 6/6 기획 작업"
              maxLength={20}
              showCount
              rightIcon={<CancelIcon />}
              onRightIconClick={() => setProjectTitle("")}
              rightIconClassName={cn("text-gray-100", projectTitle.length === 0 && "text-gray-800")}
              className="body-2 text-gray-200 placeholder:text-gray-800"
            />
          ) : (
            <div className="flex flex-col">
              <div className="rounded-4 relative h-[166px] border border-gray-700 p-4">
                <textarea
                  value={projectTask}
                  onChange={event => setProjectTask(event.target.value.slice(0, 250))}
                  maxLength={250}
                  placeholder={"1. 어드민 페이지 화면 작업\n2.\n3.\n4.\n5."}
                  className="body-2 h-full w-full resize-none bg-transparent text-gray-300 outline-none placeholder:text-gray-700"
                />
                <span className="body-4 absolute right-4 bottom-3 text-gray-400">
                  {projectTask.length}/250
                </span>
              </div>
            </div>
          )}

          <div
            className={cn(
              "mt-auto grid gap-1.5",
              projectSheetStep === "tag" ? "grid-cols-1" : "grid-cols-2",
            )}>
            {projectSheetStep !== "tag" && (
              <Button
                size="lg"
                variant="gray"
                onClick={handleProjectPrevious}
                className="text-offwhite-500 w-full bg-gray-400/40">
                이전
              </Button>
            )}
            <Button
              size="lg"
              disabled={!canGoNext}
              onClick={handleProjectNext}
              className={cn(
                "w-full",
                canGoNext ? "w-full bg-white text-gray-900" : "text-offwhite-500 bg-gray-400/40",
              )}>
              {projectSheetStep === "task" ? "완료" : "다음"}
            </Button>
          </div>
        </div>
      </BottomSheet>
    </>
  );
}
