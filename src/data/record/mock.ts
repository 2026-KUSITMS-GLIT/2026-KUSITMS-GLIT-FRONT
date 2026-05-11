export const RECORD_HOME_MOCK = {
  userName: "다솔",
  streakDays: 12,
};

export const TODAY_TASK_MOCK = {
  initialDate: new Date("2026-04-29"),
  projectTags: [
    "졸업 프로젝트",
    "큐시즘 스터디",
    "사이드 프로젝트",
    "기업 프로젝트",
    "웹 메이커스",
    "개인 프로젝트",
    "수업 과제",
  ],
  scrumDates: [
    new Date("2026-04-15"),
    new Date("2026-04-17"),
    new Date("2026-04-18"),
    new Date("2026-04-24"),
  ],
};

export const DEEP_LOG_MOCK = {
  projects: [
    {
      id: 1,
      tag: "밋업 프로젝트",
      title: "4/22 기획 작업",
      tasks: [
        { id: 101, title: "유저 리서치 문항 설계" },
        { id: 102, title: "유사 서비스 분석 및 정리" },
      ],
    },
    {
      id: 2,
      tag: "졸업 프로젝트",
      title: "4/22 기획 작업",
      tasks: [{ id: 201, title: "와이어프레임 작업" }],
    },

    {
      id: 3,
      tag: "졸업 프로젝트",
      title: "4/22 기획 작업",
      tasks: [{ id: 301, title: "와이어프레임 작업" }],
    },
    {
      id: 4,
      tag: "졸업 프로젝트",
      title: "4/22 기획 작업",
      tasks: [{ id: 401, title: "와이어프레임 작업" }],
    },
  ],
};

export const SELECT_SKILLS_MOCK = {
  project: {
    tag: "밋업 프로젝트",
    title: "4/22 기획 작업",
    task: "유저 리서치 문항 설계",
  },
  skills: [
    {
      id: 1,
      label: "발견/분석",
      colorClassName: "bg-tag-100",
      textClassName: "text-offwhite-400",
    },
    {
      id: 2,
      label: "기획/실행",
      colorClassName: "bg-tag-200",
      textClassName: "text-offwhite-400",
    },
    {
      id: 3,
      label: "협업/조율",
      colorClassName: "bg-tag-300",
      textClassName: "text-typo-primary",
    },
    {
      id: 4,
      label: "문제해결/개선",
      colorClassName: "bg-tag-400",
      textClassName: "text-white",
    },
    {
      id: 5,
      label: "성찰/성장",
      colorClassName: "bg-tag-500",
      textClassName: "text-white",
    },
  ],
};
