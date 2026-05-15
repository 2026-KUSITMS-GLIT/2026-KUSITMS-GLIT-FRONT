import { useQuery } from "@tanstack/react-query";

import { getMe } from "@/lib/apis/user/getMe";

export const useGetMe = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });
