"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";

import { reissue } from "@/lib/apis/client";
import { isTokenExpired } from "@/lib/utils/token";
import { useAuthStore } from "@/store/authStore";
import { ApiError } from "@/types/api";

type AuthStatus = "loading" | "ready" | "redirect";

interface AuthGateProps {
  children: React.ReactNode;
  initialAuthReady: boolean;
}

const AuthGatePlaceholder = () => (
  <div className="h-dvh w-full bg-gray-900" aria-busy="true" aria-label="로딩 중" />
);

export default function AuthGate({ children, initialAuthReady }: AuthGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPath = pathname.startsWith("/auth");

  const [status, setStatus] = useState<AuthStatus>(() => {
    if (isAuthPath) return "ready";
    return initialAuthReady ? "ready" : "loading";
  });

  const routerRef = useRef(router);

  useLayoutEffect(() => {
    if (isAuthPath) {
      setStatus("ready");
      return;
    }

    const { accessToken, refreshToken, setTokens, clearTokens } = useAuthStore.getState();
    const hasValidToken = !!accessToken && !isTokenExpired(accessToken);
    const canReissue = !!refreshToken || window.location.protocol === "https:";

    if (!hasValidToken && !canReissue) {
      clearTokens();
      setStatus("redirect");
      routerRef.current.replace("/auth");
      return;
    }

    setStatus("ready");

    if (hasValidToken) return;

    let active = true;

    const attemptReissue = (retryCount = 0) => {
      reissue()
        .then(tokens => {
          if (!active) return;
          setTokens(tokens.accessToken, tokens.refreshToken);
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
  }, [isAuthPath]);

  if (isAuthPath || status === "ready") return <>{children}</>;
  if (status === "redirect") return null;

  return <AuthGatePlaceholder />;
}
