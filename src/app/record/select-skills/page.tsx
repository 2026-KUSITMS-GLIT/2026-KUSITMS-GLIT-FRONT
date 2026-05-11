"use client";

import Image from "next/image";
import { useState } from "react";
import { createPortal } from "react-dom";

import HeartDefaultImage from "@/assets/images/record/hearts-2.png";
import HeartFilledImage from "@/assets/images/record/hearts-3.png";
import Chip from "@/components/common/Chip";
import CTA from "@/components/common/CTA";
import Popover from "@/components/common/Popover";
import ProgressBar from "@/components/common/ProgressBar";
import RecordProjectCard from "@/components/record/RecordProjectCard";
import { SELECT_SKILLS_MOCK } from "@/data/record/mock";
import { cn } from "@/lib/utils/cn";

import { useSkillPopover } from "./hooks/useSkillPopover";

const SELECT_SKILL_OPTIONS = SELECT_SKILLS_MOCK.skills;

type SelectedSkillMap = Record<number, number>;

export default function SelectSkillsPage() {
  const [selectedSkillIds, setSelectedSkillIds] = useState<SelectedSkillMap>({});
  const { openedTaskId, popoverPosition, skillTriggerRefs, closePopover, togglePopover } =
    useSkillPopover();

  const totalTaskCount = SELECT_SKILLS_MOCK.projects.reduce(
    (count, project) => count + project.tasks.length,
    0,
  );
  const hasMultipleProjects = SELECT_SKILLS_MOCK.projects.length >= 2;
  const selectedTaskCount = Object.keys(selectedSkillIds).length;
  const isEverySkillSelected = selectedTaskCount === totalTaskCount;

  const handleSkillClick = (taskId: number, skillId: number) => {
    setSelectedSkillIds(prev => ({
      ...prev,
      [taskId]: skillId,
    }));
    closePopover();
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {hasMultipleProjects && <ProgressBar value={selectedTaskCount} max={totalTaskCount} />}

      {/* 이미지 멘트 영역 */}
      <section className="flex shrink-0 flex-col items-center justify-center pt-7.5 pb-5">
        <div className="relative flex items-center justify-center">
          <Image
            src={isEverySkillSelected ? HeartFilledImage : HeartDefaultImage}
            alt="직무 역량 하트"
            width={100}
            height={100}
            priority
            className="relative z-10 object-contain"
          />
        </div>

        <h2 className="head-4 mt-3.75 text-center text-white">직무 역량을 담아주세요</h2>
        <p className="body-4 text-center text-gray-500">
          오늘의 경험을 가장 잘 표현하는 직무 역량을 선택해요
        </p>
      </section>

      {/* 프로젝트 역량 선택 카드 목록 */}
      <section className="mt-3.75 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {SELECT_SKILLS_MOCK.projects.map(project => (
          <RecordProjectCard
            key={project.id}
            tag={project.tag}
            title={project.title}
            contentClassName="flex flex-col gap-1.5">
            {project.tasks.map(task => {
              const selectedSkillId = selectedSkillIds[task.id];
              const selectedSkill = SELECT_SKILL_OPTIONS.find(
                skill => skill.id === selectedSkillId,
              );
              const isSkillListOpen = openedTaskId === task.id;

              return (
                <div key={task.id} className="flex items-center gap-2">
                  <div
                    data-skill-select-menu
                    ref={element => {
                      skillTriggerRefs.current[task.id] = element;
                    }}
                    className="relative shrink-0">
                    <Chip
                      state="default"
                      aria-expanded={isSkillListOpen}
                      className={cn(
                        "h-7.5 py-0",
                        selectedSkill && [
                          "border-transparent",
                          selectedSkill.colorClassName,
                          selectedSkill.textClassName,
                        ],
                      )}
                      onClick={() => togglePopover(task.id)}>
                      <span>{selectedSkill?.label ?? "역량 선택"}</span>
                    </Chip>
                  </div>

                  <p className="body-2 min-w-0 flex-1 truncate text-white">{task.title}</p>
                </div>
              );
            })}
          </RecordProjectCard>
        ))}
      </section>

      {/* 심화 기록하기 CTA 영역 */}
      <div className="relative z-0 shrink-0 py-4">
        <CTA disabled={!isEverySkillSelected}>심화 기록하기</CTA>
      </div>

      {openedTaskId !== null &&
        popoverPosition &&
        createPortal(
          <div
            data-skill-select-menu
            className="fixed z-[100] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={popoverPosition}>
            <Popover
              className="w-37.5"
              items={SELECT_SKILL_OPTIONS.map(skill => ({
                label: skill.label,
                dotClassName: skill.colorClassName,
                selected: selectedSkillIds[openedTaskId] === skill.id,
                onClick: () => handleSkillClick(openedTaskId, skill.id),
              }))}
            />
          </div>,
          document.body,
        )}
    </div>
  );
}
