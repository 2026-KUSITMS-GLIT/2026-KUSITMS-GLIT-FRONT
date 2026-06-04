import type { Page } from "@playwright/test";

import type { CareerReportDetail, MiniReportDetail, ReportStatus } from "@/types/report/report";

import { fulfillApiSuccess, setupAuthCookie } from "../helpers";

export { fulfillApiSuccess, setupAuthCookie };

export const MOCK_REPORT_ID_MINI = 1;
export const MOCK_REPORT_ID_CAREER = 2;
export const MOCK_REPORT_ID_GENERATE = 99;

export const MOCK_USER = {
  profileImage: null,
  nickname: "테스터",
  jobRole: "기획자",
  userStatus: "ACTIVE",
  consecutiveRecordDays: 3,
  glaring: false,
};

export const MOCK_MINI_REPORT: MiniReportDetail = {
  reportId: MOCK_REPORT_ID_MINI,
  reportType: "MINI",
  createdAt: "2026.05.01",
  selectedStarCount: 10,
  content: {
    activitySummary: "지난 10개의 심화기록을 분석한 활동 요약입니다",
    nextFocusPoint: "문제 해결 역량을 더욱 키워보세요",
    competencyFrequency: [
      { competency: "PROBLEM_SOLVING", count: 5 },
      { competency: "PLANNING_EXECUTION", count: 3 },
      { competency: "COLLABORATION", count: 2 },
      { competency: "DISCOVERY_ANALYSIS", count: 0 },
      { competency: "REFLECTION_GROWTH", count: 0 },
    ],
    topDetailTags: ["React", "API 설계", "팀워크"],
  },
};

export const MOCK_CAREER_REPORT: CareerReportDetail = {
  reportId: MOCK_REPORT_ID_CAREER,
  reportType: "CAREER",
  createdAt: "2026.05.15",
  selectedStarCount: 25,
  content: {
    brandingStatement: "데이터 기반 의사결정으로 팀을 이끄는 기획자",
    brandingPattern: "분석적 사고와 실행력의 조화",
    topDetailTags: [
      { tag: "React", count: 8 },
      { tag: "기획", count: 6 },
      { tag: "협업", count: 4 },
    ],
    narrativeSummary: "이번 기간 동안 다양한 프로젝트에서 핵심 역할을 수행했습니다",
    strengths: [
      {
        title: "문제 해결 능력",
        description: "복잡한 문제를 체계적으로 분석하고 해결합니다",
        evidences: [],
      },
      {
        title: "협업 역량",
        description: "팀원들과 효과적으로 협력합니다",
        evidences: [],
      },
    ],
    experienceHighlights: ["API 연동 프로젝트 주도", "팀 내 기술 가이드 작성"],
    interviewQuestions: [{ question: "가장 어려웠던 프로젝트 경험을 말해주세요", evidences: [] }],
  },
};

type ReportApiMockOptions = {
  reportDetail?: MiniReportDetail | CareerReportDetail | null;
  generateStatus?: ReportStatus;
};

export async function setupReportApiMocks(page: Page, options: ReportApiMockOptions = {}) {
  const { reportDetail, generateStatus } = options;

  await page.route("**/api/users/me", async route => {
    await route.fulfill(fulfillApiSuccess(MOCK_USER));
  });

  if (reportDetail !== undefined) {
    // /api/reports/{id} 정확히 매칭 (status/retry 엔드포인트 제외)
    await page.route(/\/api\/reports\/\d+(\?|$)/, async route => {
      if (route.request().method() === "GET") {
        await route.fulfill(fulfillApiSuccess(reportDetail));
        return;
      }
      await route.continue();
    });
  }

  if (generateStatus !== undefined) {
    await page.route(/\/api\/reports\/\d+\/status/, async route => {
      await route.fulfill(
        fulfillApiSuccess({
          reportId: MOCK_REPORT_ID_GENERATE,
          status: generateStatus,
          retryAvailable: null,
        }),
      );
    });
  }

  await page.route(/\/api\/reports\/\d+\/retry/, async route => {
    await route.fulfill(fulfillApiSuccess({ reportId: MOCK_REPORT_ID_GENERATE }));
  });
}

export async function gotoReportPage(page: Page, path: string, mockOptions?: ReportApiMockOptions) {
  await setupAuthCookie(page);
  await setupReportApiMocks(page, mockOptions);
  await page.goto(path, { waitUntil: "domcontentloaded" });
}
