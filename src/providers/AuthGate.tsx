"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { reissue } from "@/api/client";
import LoadingScreen from "@/components/common/LoadingScreen";
import { useAuthStore } from "@/store/authStore";
import { ApiError } from "@/types/api";

function isTokenExpired(token: string): boolean {
  try {
    const rawPayload = token.split(".")[1];
    if (!rawPayload) return true;

    const normalized = rawPayload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
    const payload = JSON.parse(atob(padded)) as { exp?: number };

    return typeof payload.exp !== "number" || payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPath = pathname.startsWith("/auth");

  const [ready, setReady] = useState(false);

  const routerRef = useRef(router);
  const isAuthPathRef = useRef(isAuthPath);

  useEffect(() => {
    if (isAuthPathRef.current) return;

    const { accessToken, refreshToken, setTokens, clearTokens } = useAuthStore.getState();

    if (accessToken && !isTokenExpired(accessToken)) {
      Promise.resolve().then(() => setReady(true));
      return;
    }

    const canReissue = !!refreshToken || window.location.protocol === "https:";
    if (!canReissue) {
      clearTokens();
      routerRef.current.replace("/auth");
      return;
    }

    let active = true;

    const attemptReissue = (retryCount = 0) => {
      reissue()
        .then(tokens => {
          if (!active) return;
          setTokens(tokens.accessToken, tokens.refreshToken);
          setReady(true);
        })
        .catch(error => {
          if (!active) return;
          if (error instanceof ApiError) {
            clearTokens();
            routerRef.current.replace("/auth");
          } else if (retryCount < 1) {
            setTimeout(() => {
              if (active) attemptReissue(retryCount + 1);
            }, 2000);
          } else {
            clearTokens();
            routerRef.current.replace("/auth");
          }
        });
    };

    attemptReissue();

    return () => {
      active = false;
    };
  }, []);

  if (!ready && !isAuthPath) return <LoadingScreen />;
  return <>{children}</>;
}
