import { redirect } from "next/navigation";
import { cache } from "react";

import { serverApi } from "@/api/server";
import type { UserProfile } from "@/types/user/user";

export const getMe = cache(() => serverApi.get<UserProfile>("/api/users/me"));

export const getMeRequired = async () => {
  const profile = await getMe();

  if (!profile) redirect("/auth");

  return profile;
};
