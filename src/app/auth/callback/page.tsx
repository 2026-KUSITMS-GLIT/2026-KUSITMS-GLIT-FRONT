"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import { useAuthStore } from "@/store/authStore";

const CallbackHandler = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setTokens = useAuthStore(state => state.setTokens);

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken") ?? undefined;

    if (!accessToken) {
      router.replace("/auth");
      return;
    }

    setTokens(accessToken, refreshToken);
    router.replace("/");
  }, [searchParams, setTokens, router]);

  return null;
};

const Page = () => (
  <Suspense>
    <CallbackHandler />
  </Suspense>
);

export default Page;
