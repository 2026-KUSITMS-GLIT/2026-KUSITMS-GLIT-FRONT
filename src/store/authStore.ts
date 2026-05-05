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
      .find((row) => row.startsWith(`${name}=`))
      ?.slice(name.length + 1) ?? null
  );
};

const setCookie = (name: string, value: string) => {
  document.cookie = `${name}=${value}; path=/; samesite=lax`;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; path=/; max-age=0`;
};

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: getCookie("GLIT_ACCESS_TOKEN"),
  refreshToken: getCookie("GLIT_REFRESH_TOKEN"),
  setTokens: (accessToken, refreshToken) => {
    setCookie("GLIT_ACCESS_TOKEN", accessToken);
    if (refreshToken) setCookie("GLIT_REFRESH_TOKEN", refreshToken);
    set((state) => ({
      accessToken,
      refreshToken: refreshToken ?? state.refreshToken,
    }));
  },
  clearTokens: () => {
    deleteCookie("GLIT_ACCESS_TOKEN");
    deleteCookie("GLIT_REFRESH_TOKEN");
    set({ accessToken: null, refreshToken: null });
  },
}));

