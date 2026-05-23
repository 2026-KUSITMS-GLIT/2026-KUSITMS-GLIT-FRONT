import { type QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/api/client";
import { useAuthStore } from "@/store/authStore";
import type { UserProfile } from "@/types/user/user";

const fetchMeClient = () => api.get<UserProfile>("/api/users/me");

export const meQueryKey = ["me"] as const;

export const invalidateMe = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: meQueryKey });

interface UseMeOptions {
  enabled?: boolean;
}

export const useMe = (options?: UseMeOptions) => {
  const accessToken = useAuthStore(state => state.accessToken);

  return useQuery({
    queryKey: meQueryKey,
    queryFn: fetchMeClient,
    enabled: options?.enabled !== false && !!accessToken,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useInvalidateMe = () => {
  const queryClient = useQueryClient();

  return () => invalidateMe(queryClient);
};
