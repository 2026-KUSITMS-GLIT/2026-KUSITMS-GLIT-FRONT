import { expect, test } from "@playwright/test";

import {
  gotoReportPage,
  MOCK_CAREER_REPORT,
  MOCK_MINI_REPORT,
  MOCK_REPORT_ID_CAREER,
  MOCK_REPORT_ID_MINI,
  MOCK_USER,
} from "./helpers";

const MINI_PATH = `/report/mini/${MOCK_REPORT_ID_MINI}`;
const CAREER_PATH = `/report/career/${MOCK_REPORT_ID_CAREER}`;

test.describe("미니 리포트 상세 페이지", () => {
  test.describe.configure({ mode: "serial", timeout: 30_000 });

  test.beforeEach(async ({ page }) => {
    await gotoReportPage(page, MINI_PATH, { reportDetail: MOCK_MINI_REPORT });
    await expect(page.getByText(`${MOCK_USER.nickname}님의 미니 리포트가 나왔어요`)).toBeVisible({
      timeout: 10_000,
    });
  });

  test("기본 헤더 및 심화기록 수가 표시되어야 한다", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "미니 리포트" })).toBeVisible();
    await expect(
      page.getByText(`벌써 ${MOCK_MINI_REPORT.selectedStarCount}개의 심화기록이 쌓였어요!`),
    ).toBeVisible();
  });

  test("활동 요약이 표시되어야 한다", async ({ page }) => {
    await expect(page.getByText("지금까지의 활동요약")).toBeVisible();
    await expect(
      page.getByText(MOCK_MINI_REPORT.content.activitySummary, { exact: false }),
    ).toBeVisible();
  });

  test("앞으로 주목할 포인트가 표시되어야 한다", async ({ page }) => {
    await expect(page.getByText("앞으로 주목할 포인트")).toBeVisible();
    await expect(page.getByText(MOCK_MINI_REPORT.content.nextFocusPoint)).toBeVisible();
  });

  test("역량 통계가 표시되어야 한다", async ({ page }) => {
    // CompetencyStatsSection에서 각 역량 레이블이 렌더됨
    await expect(page.getByText("문제해결/개선")).toBeVisible();
    await expect(page.getByText("기획/실행")).toBeVisible();
    await expect(page.getByText("협업/조율")).toBeVisible();
    // 카운트 표시 확인 (가장 높은 PROBLEM_SOLVING: 5회) - 여러 곳에 렌더될 수 있어 first() 사용
    await expect(page.getByText("5회").first()).toBeVisible();
  });

  test("상단 태그 목록이 표시되어야 한다", async ({ page }) => {
    for (const tag of MOCK_MINI_REPORT.content.topDetailTags) {
      // exact: true로 MostRecordSection의 쉼표 구분 텍스트와 구분
      await expect(page.getByText(tag, { exact: true }).first()).toBeVisible();
    }
  });

  test("뒤로 가기 버튼 클릭 시 리포트 목록 페이지로 이동해야 한다", async ({ page }) => {
    // Header의 왼쪽 버튼이 onLeftClick → router.push("/report")
    const backButton = page.locator("header button").first();
    await backButton.click();
    await expect(page).toHaveURL(/\/report$/, { timeout: 10_000 });
  });
});

test.describe("커리어 리포트 상세 페이지", () => {
  test.describe.configure({ mode: "serial", timeout: 30_000 });

  test.beforeEach(async ({ page }) => {
    await gotoReportPage(page, CAREER_PATH, { reportDetail: MOCK_CAREER_REPORT });
    await expect(page.getByText(`${MOCK_USER.nickname}님의 커리어 리포트가 나왔어요`)).toBeVisible({
      timeout: 10_000,
    });
  });

  test("기본 헤더 및 심화기록 수가 표시되어야 한다", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "커리어 리포트" })).toBeVisible();
    await expect(
      page.getByText(`벌써 ${MOCK_CAREER_REPORT.selectedStarCount}개의 심화기록이 쌓였어요!`),
    ).toBeVisible();
  });

  test("브랜딩 스테이트먼트가 표시되어야 한다", async ({ page }) => {
    await expect(page.getByText(MOCK_CAREER_REPORT.content.brandingStatement)).toBeVisible();
  });

  test("내러티브 요약이 표시되어야 한다", async ({ page }) => {
    await expect(
      page.getByText(MOCK_CAREER_REPORT.content.narrativeSummary, { exact: false }),
    ).toBeVisible();
  });

  test("강점 카드가 표시되어야 한다", async ({ page }) => {
    for (const strength of MOCK_CAREER_REPORT.content.strengths) {
      await expect(page.getByText(strength.title)).toBeVisible();
      await expect(page.getByText(strength.description)).toBeVisible();
    }
  });

  test("경험 하이라이트가 표시되어야 한다", async ({ page }) => {
    for (const highlight of MOCK_CAREER_REPORT.content.experienceHighlights) {
      await expect(page.getByText(highlight, { exact: false })).toBeVisible();
    }
  });

  test("인터뷰 질문이 표시되어야 한다", async ({ page }) => {
    await expect(
      page.getByText(MOCK_CAREER_REPORT.content.interviewQuestions[0].question, {
        exact: false,
      }),
    ).toBeVisible();
  });

  test("뒤로 가기 버튼 클릭 시 리포트 목록 페이지로 이동해야 한다", async ({ page }) => {
    const backButton = page.locator("header button").first();
    await backButton.click();
    await expect(page).toHaveURL(/\/report$/, { timeout: 10_000 });
  });
});

test.describe("리포트 상세 페이지 - 잘못된 타입 처리", () => {
  test("미니 리포트 경로에서 커리어 리포트 데이터 반환 시 /report로 리다이렉트되어야 한다", async ({
    page,
  }) => {
    // miniId 경로이지만 CAREER 타입 데이터를 반환
    await gotoReportPage(page, MINI_PATH, { reportDetail: MOCK_CAREER_REPORT });
    await expect(page).toHaveURL(/\/report$/, { timeout: 10_000 });
  });

  test("커리어 리포트 경로에서 미니 리포트 데이터 반환 시 /report로 리다이렉트되어야 한다", async ({
    page,
  }) => {
    // careerId 경로이지만 MINI 타입 데이터를 반환
    await gotoReportPage(page, CAREER_PATH, { reportDetail: MOCK_MINI_REPORT });
    await expect(page).toHaveURL(/\/report$/, { timeout: 10_000 });
  });
});
