import type { SocialProvider } from "@/types/auth/auth";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// GA 미로드(ID 없는 환경)면 아무 일도 하지 않음
export const trackGA = (event: string, params?: Record<string, unknown>) => {
  if (typeof window === "undefined") return;
  window.gtag?.("event", event, params);
};

// OAuth 콜백에 소셜 종류 정보가 없어 로그인 클릭 시 저장해 두고 콜백에서 사용
const LOGIN_METHOD_KEY = "glit-login-method";

export const saveLoginMethod = (provider: SocialProvider) => {
  try {
    localStorage.setItem(LOGIN_METHOD_KEY, provider);
  } catch {}
};

export const popLoginMethod = () => {
  try {
    const method = localStorage.getItem(LOGIN_METHOD_KEY);
    localStorage.removeItem(LOGIN_METHOD_KEY);
    return method;
  } catch {
    return null;
  }
};
