import { expect, type Page, test } from "@playwright/test";

// exp=9999999999 (2286년) — isTokenExpired()는 서명 검증 없이 exp 필드만 확인하므로 통과
const FAKE_ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjk5OTk5OTk5OTksInN1YiI6InRlc3QifQ.fakesig";

const MOCK_USER = {
  profileImage: null,
  nickname: "테스트유저",
  jobRole: "개발자",
  userStatus: "취준",
  consecutiveRecordDays: 0,
  glaring: false,
};

const waitForPage = async (page: Page) => {
  // 1) 페이크 accessToken 쿠키 주입 → AuthGate hasValidToken=true → /auth 리다이렉트 방지
  await page
    .context()
    .addCookies([
      { name: "accessToken", value: FAKE_ACCESS_TOKEN, domain: "localhost", path: "/" },
    ]);

  // 2) 외부 API 모킹 → 401 방지 → afterResponse 훅의 clearTokens() + 리다이렉트 방지
  //    - GET /api/users/me → mock 유저 데이터 반환
  //    - 나머지 API 요청 → success:true, data:null (알림 설정 patch 등 포함)
  await page.route("https://stg-api.glit.today/**", async route => {
    const isGetMe =
      route.request().method() === "GET" && route.request().url().includes("/api/users/me");

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: isGetMe ? MOCK_USER : null }),
    });
  });

  await page.goto("/");
  // nav가 나타날 때까지 대기 = 실제 홈 페이지가 렌더링 완료된 시점
  await page.waitForSelector("nav", { timeout: 15000 });
};

test.describe("홈 페이지", () => {
  test.beforeEach(async ({ page }) => {
    await waitForPage(page);
  });

  test("홈 페이지가 로드된다", async ({ page }) => {
    await expect(page).toHaveURL("/");
  });

  test("강점 확인 안내 문구가 표시된다", async ({ page }) => {
    await expect(page.locator("p").filter({ hasText: /님의 강점을 확인해보세요/ })).toBeVisible();
  });

  test("기록하러 가기 버튼이 표시된다", async ({ page }) => {
    await expect(page.getByRole("link", { name: "기록하러 가기" })).toBeVisible();
  });

  test("기록하러 가기 링크가 /record/today-task 경로를 가리킨다", async ({ page }) => {
    await expect(page.getByRole("link", { name: "기록하러 가기" })).toHaveAttribute(
      "href",
      "/record/today-task",
    );
  });

  test("하단 네비게이션 바가 표시된다", async ({ page }) => {
    await expect(page.getByRole("navigation")).toBeVisible();
  });
});

test.describe("알림 권한 요청 (NotificationPermission)", () => {
  // handleFirstClick:
  //   if (Notification.permission === "denied") return;
  //   if (localStorage.getItem("notification_asked")) return;
  //   localStorage.setItem("notification_asked", "true");  ← 동기적으로 즉시 저장
  //   requestNotificationPermission();                     ← async, Notification.requestPermission 호출

  test("최초 방문 후 화면 클릭 시 알림 권한 요청이 호출된다", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, "Notification", {
        value: class {
          static permission: NotificationPermission = "default";
          static requestPermission = async (): Promise<NotificationPermission> => {
            (window as Window & { __notificationRequested?: boolean }).__notificationRequested =
              true;
            return "default";
          };
        },
        configurable: true,
        writable: true,
      });
    });

    await waitForPage(page);
    await page.evaluate(() => localStorage.removeItem("notification_asked"));

    // max-w-107.5(430px) mx-auto 로 중앙 정렬된 컨텐츠 영역 안을 클릭해야
    // handleFirstClick 이벤트가 도달함 (body x=100 은 데스크탑 뷰포트 밖)
    await page
      .locator("p")
      .filter({ hasText: /님의 강점을 확인해보세요/ })
      .click();

    // requestNotificationPermission()은 async이므로 완료될 때까지 폴링 대기
    await page.waitForFunction(
      () => !!(window as Window & { __notificationRequested?: boolean }).__notificationRequested,
      { timeout: 5000 },
    );

    const requested = await page.evaluate(
      () => !!(window as Window & { __notificationRequested?: boolean }).__notificationRequested,
    );
    expect(requested).toBe(true);
  });

  test("이미 알림을 요청한 경우 재요청하지 않는다", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, "Notification", {
        value: class {
          static permission: NotificationPermission = "default";
          static requestPermission = async (): Promise<NotificationPermission> => {
            (window as Window & { __notificationRequested?: boolean }).__notificationRequested =
              true;
            return "default";
          };
        },
        configurable: true,
        writable: true,
      });
      localStorage.setItem("notification_asked", "true");
    });

    await waitForPage(page);
    await page
      .locator("p")
      .filter({ hasText: /님의 강점을 확인해보세요/ })
      .click();
    await page.waitForTimeout(500);

    const requested = await page.evaluate(
      () => !!(window as Window & { __notificationRequested?: boolean }).__notificationRequested,
    );
    expect(requested).toBe(false);
  });

  test("알림 권한이 denied이면 요청하지 않는다", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, "Notification", {
        value: class {
          static permission: NotificationPermission = "denied";
          static requestPermission = async (): Promise<NotificationPermission> => {
            (window as Window & { __notificationRequested?: boolean }).__notificationRequested =
              true;
            return "denied";
          };
        },
        configurable: true,
        writable: true,
      });
    });

    await waitForPage(page);
    await page.evaluate(() => localStorage.removeItem("notification_asked"));
    await page
      .locator("p")
      .filter({ hasText: /님의 강점을 확인해보세요/ })
      .click();
    await page.waitForTimeout(500);

    const requested = await page.evaluate(
      () => !!(window as Window & { __notificationRequested?: boolean }).__notificationRequested,
    );
    expect(requested).toBe(false);
  });

  test("첫 클릭 시 notification_asked가 localStorage에 저장된다", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, "Notification", {
        value: class {
          static permission: NotificationPermission = "default";
          static requestPermission = async (): Promise<NotificationPermission> => "granted";
        },
        configurable: true,
        writable: true,
      });
    });

    await waitForPage(page);
    await page.evaluate(() => localStorage.removeItem("notification_asked"));

    await page
      .locator("p")
      .filter({ hasText: /님의 강점을 확인해보세요/ })
      .click();

    // localStorage.setItem("notification_asked", "true")은 동기적으로 실행되므로 바로 확인 가능
    const asked = await page.evaluate(() => localStorage.getItem("notification_asked"));
    expect(asked).toBe("true");
  });
});
