import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (accessToken: string, refreshToken?: string) => void;
  clearTokens: () => void;
}

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  return (
    document.cookie
      .split("; ")
      .find(row => row.startsWith(`${name}=`))
      ?.slice(name.length + 1) ?? null
  );
};

const setCookie = (name: string, value: string, maxAge: number) => {
  const secure = process.env.NODE_ENV === "production" ? "; secure" : "";
  document.cookie = `${name}=${value}; path=/; samesite=lax; max-age=${maxAge}${secure}`;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; path=/; max-age=0`;
};

export const useAuthStore = create<AuthState>()(set => ({
  accessToken: getCookie("GLIT_ACCESS_TOKEN"),
  refreshToken: getCookie("refreshToken"),
  setTokens: (accessToken, refreshToken) => {
    setCookie("GLIT_ACCESS_TOKEN", accessToken, 60 * 60 * 24);
    if (refreshToken) setCookie("refreshToken", refreshToken, 60 * 60 * 24 * 7);
    set(state => ({
      accessToken,
      refreshToken: refreshToken ?? state.refreshToken,
    }));
  },
  clearTokens: () => {
    deleteCookie("GLIT_ACCESS_TOKEN");
    deleteCookie("refreshToken");
    set({ accessToken: null, refreshToken: null });
  },
}));
