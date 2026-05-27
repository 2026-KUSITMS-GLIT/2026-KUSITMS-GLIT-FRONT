"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { reissue } from "@/api/client";
import LoadingScreen from "@/components/common/LoadingScreen";
import { useAuthStore } from "@/store/authStore";

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPath = pathname.startsWith("/auth");

  const [ready, setReady] = useState(() => {
    if (isAuthPath) return true;
    const { accessToken } = useAuthStore.getState();
    return !!accessToken && !isTokenExpired(accessToken);
  });

  const routerRef = useRef(router);
  const readyRef = useRef(ready);

  useEffect(() => {
    if (readyRef.current) return;

    const { refreshToken, setTokens, clearTokens } = useAuthStore.getState();
    const canReissue = !!refreshToken || window.location.protocol === "https:";
    if (!canReissue) {
      clearTokens();
      routerRef.current.replace("/auth");
      return;
    }

    let active = true;
    reissue()
      .then(tokens => {
        if (!active) return;
        setTokens(tokens.accessToken, tokens.refreshToken);
        setReady(true);
      })
      .catch(() => {
        if (!active) return;
        clearTokens();
        routerRef.current.replace("/auth");
      });

    return () => {
      active = false;
    };
  }, []);

  if (!ready && !isAuthPath) return <LoadingScreen />;
  return <>{children}</>;
}
