"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { useMe } from "@/lib/hooks/user/userClient";

function ProvidersContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useMe({ enabled: !pathname.startsWith("/auth") });

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
