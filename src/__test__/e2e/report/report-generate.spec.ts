import { expect, test } from "@playwright/test";

import { fulfillApiSuccess, gotoReportPage, MOCK_REPORT_ID_GENERATE } from "./helpers";

const MINI_GENERATE_PATH = `/report/generate?type=mini&reportId=${MOCK_REPORT_ID_GENERATE}`;
const CAREER_GENERATE_PATH = `/report/generate?type=career&reportId=${MOCK_REPORT_ID_GENERATE}`;

test.describe("리포트 생성 페이지", () => {
  test.describe.configure({ mode: "serial", timeout: 60_000 });

  test("미니 리포트 생성 중 타이틀이 표시되어야 한다", async ({ page }) => {
    await gotoReportPage(page, MINI_GENERATE_PATH, { generateStatus: "GENERATING" });

    await expect(page.getByText("미니 리포트를 생성하고 있어요!")).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByText("최대 1분 정도 소요될 수 있어요.")).toBeVisible();
  });

  test("커리어 리포트 생성 중 타이틀이 표시되어야 한다", async ({ page }) => {
    await gotoReportPage(page, CAREER_GENERATE_PATH, { generateStatus: "GENERATING" });

    await expect(page.getByText("커리어 리포트를 생성하고 있어요!")).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByText("최대 1분 정도 소요될 수 있어요.")).toBeVisible();
  });

  test("진행률 텍스트가 표시되어야 한다", async ({ page }) => {
    await gotoReportPage(page, MINI_GENERATE_PATH, { generateStatus: "GENERATING" });

    // 초기 렌더링에서 0% 완료가 표시됨
    await expect(page.getByText(/\d+% 완료/)).toBeVisible({ timeout: 10_000 });
  });

  test("리포트 생성 중 캐릭터 이미지가 표시되어야 한다", async ({ page }) => {
    await gotoReportPage(page, MINI_GENERATE_PATH, { generateStatus: "GENERATING" });

    await expect(page.getByAltText("리포트 생성 중")).toBeVisible({ timeout: 10_000 });
  });

  test("생성 완료(SUCCESS) 시 미니 리포트 상세 페이지로 이동해야 한다", async ({ page }) => {
    // SUCCESS 상태를 즉시 반환 → 2초 폴링 + 2초 리다이렉트 딜레이 = 약 4초 대기
    await gotoReportPage(page, MINI_GENERATE_PATH, { generateStatus: "SUCCESS" });

    await expect(page).toHaveURL(new RegExp(`/report/mini/${MOCK_REPORT_ID_GENERATE}`), {
      timeout: 15_000,
    });
  });

  test("생성 완료(SUCCESS) 시 커리어 리포트 상세 페이지로 이동해야 한다", async ({ page }) => {
    await gotoReportPage(page, CAREER_GENERATE_PATH, { generateStatus: "SUCCESS" });

    await expect(page).toHaveURL(new RegExp(`/report/career/${MOCK_REPORT_ID_GENERATE}`), {
      timeout: 15_000,
    });
  });

  test("생성 실패(FAILED) + retry 불가 시 생성 페이지를 벗어나야 한다", async ({ page }) => {
    // FAILED + retryAvailable=false → router.replace("/report/create")
    // 테스트 환경에서 /report/create SSR이 스테이징 API 인증 실패로 /auth로 이어질 수 있음
    // → 최종 URL이 /report/generate가 아닌 것으로 검증
    await gotoReportPage(page, MINI_GENERATE_PATH);

    await page.route(/\/api\/reports\/\d+\/status/, async route => {
      await route.fulfill(
        fulfillApiSuccess({
          reportId: MOCK_REPORT_ID_GENERATE,
          status: "FAILED",
          retryAvailable: false,
        }),
      );
    });

    await expect(page).not.toHaveURL(/\/report\/generate/, { timeout: 15_000 });
  });
});
