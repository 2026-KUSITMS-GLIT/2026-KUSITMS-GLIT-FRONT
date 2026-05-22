"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { useMe } from "@/lib/hooks/user/useMe";

function ProvidersContent({ children }: { children: React.ReactNode }) {
  useMe();

  return children;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    import("@/lib/utils/fcm");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ProvidersContent>{children}</ProvidersContent>
    </QueryClientProvider>
  );
}
